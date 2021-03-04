import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import MetaData from './layout/MetaData';
import Product from './product/Product';
import Loader from './layout/Loader';

import { getProducts } from '../actions/productActions';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const categories = [
    'Electronics',
    'Cameras',
    'Laptop',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home',
  ];
  const [currentPage, setCurrentPage] = useState(1);

  const keyword = match.params.keyword;

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const alert = useAlert();
  const dispatch = useDispatch();

  const {
    loading,
    products,
    errors,
    productsCount,
    resPerPage,
    filterProductCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (errors) {
      return alert.error(errors);
    }

    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [currentPage, dispatch, alert, errors, keyword, price, category, rating]);

  let count = productsCount;
  if (keyword) {
    count = filterProductCount;
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <MetaData title={'Buy Best Product Online'} />
          <h1 id="products_heading">Latest Product</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <React.Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{ 1: `$1`, 1000: `$1000` }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />

                      <hr className="my-5" />

                      <div className="mt-5">
                        <h4 className="mb-3">Categories</h4>
                        <ul className="pl-0">
                          {categories.map((item, idx) => (
                            <li
                              style={{
                                cursor: 'pointer',
                                listStyleType: 'none',
                              }}
                              key={idx}
                              onClick={() => setCategory(item)}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <hr className="my-3" />

                      <div className="mt-5">
                        <h4 className="mb-3">Rating</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((star, idx) => (
                            <li
                              style={{
                                cursor: 'pointer',
                                listStyleType: 'none',
                              }}
                              key={idx}
                              onClick={() => setRating(star)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{
                                    width: `${star * 20}%`,
                                  }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            keyword={keyword}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                products &&
                products.map((product) => (
                  <Product
                    key={product._id}
                    product={product}
                    keyword={keyword}
                    col={3}
                  />
                ))
              )}
            </div>
          </section>
          {resPerPage <= count && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={count}
                onChange={setCurrentPageNo}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                linkClass="page-link"
                itemClass="page-item"
              />
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
