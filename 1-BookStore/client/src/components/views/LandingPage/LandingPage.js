import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Col, Card, Row, Button } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { Years, Books } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';

const { Meta } = Card;

function LandingPage() {
	const [ Products, setProducts ] = useState([]);
	const [ Skip, setSkip ] = useState(0);
	const [ Limit, setLimit ] = useState(8);
	const [ PostSize, setPostSize ] = useState();
	const [ SearchTerms, setSearchTerms ] = useState('');

	const [ Filters, setFilters ] = useState({
		Years: [],
		Books: []
	});

	useEffect(() => {
		const variables = {
			skip: Skip,
			limit: Limit
		};

		getProducts(variables);
	}, []);

	const getProducts = (variables) => {
		Axios.post('/api/product/getProducts', variables).then((response) => {
			if (response.data.success) {
				if (variables.loadMore) {
					setProducts([ ...Products, ...response.data.products ]);
				} else {
					setProducts(response.data.products);
				}
				setPostSize(response.data.postSize);
			} else {
				alert('Failed to fectch product datas');
			}
		});
	};

	const onLoadMore = () => {
		let skip = Skip + Limit;

		const variables = {
			skip: skip,
			limit: Limit,
			loadMore: true,
			filters: Filters,
			searchTerm: SearchTerms
		};
		getProducts(variables);
		setSkip(skip);
	};

	const renderCards = Products.map((product, index) => {
		return (
			<React.Fragment>
				<Col lg={3} md={4} xs={12}>
					{/* <Card
						hoverable={true}
						cover={
							<a href={`/product/${product._id}`}>
								{' '}
								<ImageSlider images={product.images} />
							</a>
						}
					/> */}
					<a href={`/product/${product._id}`}>
						{' '}
						<ImageSlider images={product.images} />
					</a>
				</Col>
				<Col lg={3} md={4} xs={12}>
					<Meta className="meta-text" style={{marginTop: "50px"}} title={product.title} />
				</Col>
				<Col lg={6} md={8} xs={24}>
					<Button href={`/product/${product._id}`} style={{margin: "65px"}}>View Product Details</Button>
				</Col>
			</React.Fragment>
		);
	});

	const showFilteredResults = (filters) => {
		const variables = {
			skip: 0,
			limit: Limit,
			filters: filters
		};
		getProducts(variables);
		setSkip(0);
	};

	const handleBooks = (value) => {
		const data = Books;
		let array = [];

		for (let key in data) {
			if (data[key]._id === parseInt(value, 10)) {
				array = data[key].array;
			}
		}
		console.log('array', array);
		return array;
	};

	const handleFilters = (filters, category) => {
		const newFilters = { ...Filters };

		newFilters[category] = filters;

		if (category === 'Books') {
			let BooksValues = handleBooks(filters);
			newFilters[category] = BooksValues;
		}

		console.log(newFilters);

		showFilteredResults(newFilters);
		setFilters(newFilters);
	};

	const updateSearchTerms = (newSearchTerm) => {
		const variables = {
			skip: 0,
			limit: Limit,
			filters: Filters,
			searchTerm: newSearchTerm
		};

		setSkip(0);
		setSearchTerms(newSearchTerm);

		getProducts(variables);
	};

	return (
		<div style={{ width: '75%', margin: '3rem auto' }}>
			<div style={{ textAlign: 'left' }}>
				<h2> All Products </h2>
			</div>

			{/* Filter  */}

			<Row gutter={[ 16, 16 ]}>
				<Col lg={12} xs={24}>
					<CheckBox list={Years} handleFilters={(filters) => handleFilters(filters, 'Years')} />
				</Col>
				<Col lg={12} xs={24}>
					<RadioBox list={Books} handleFilters={(filters) => handleFilters(filters, 'Books')} />
				</Col>
			</Row>

			{/* Search  */}
			<div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
				<SearchFeature refreshFunction={updateSearchTerms} />
			</div>

			{Products.length === 0 ? (
				<div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
					<h2>No post yet...</h2>
				</div>
			) : (
				<div>
					<Row gutter={[ 16, 16 ]}>{renderCards}</Row>
				</div>
			)}
			<br />
			<br />

			{PostSize >= Limit && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<button onClick={onLoadMore}>Load More</button>
				</div>
			)}
		</div>
	);
}

export default LandingPage;
