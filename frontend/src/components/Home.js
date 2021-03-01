import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MetaData from './layout/MetaData';
import Product from './product/Product';

import { getProducts } from '../actions/productActions';

const Home = () => {
  const dispatch = useDispatch();

  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <React.Fragment>
      {loading ? (
        <h1>Loading....</h1>
      ) : (
        <React.Fragment>
          <MetaData title={'Buy Best Product Online'} />
          <h1 id="products_heading">Latest Product</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Home;
