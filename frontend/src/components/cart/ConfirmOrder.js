import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CheckoutShop from './CheckoutShop';
import MetaData from '../layout/MetaData';

const ConfirmOrder = ({ history }) => {
  const { user } = useSelector((state) => state.user);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  //calculate order Prices
  const itemPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.05 * itemPrice).toFixed(2));
  const totalPrice = (itemPrice + shippingPrice + taxPrice).toFixed(2);

  const processToPayment = () => {
    const data = {
      itemPrice: itemPrice.toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    history.push('/');
  };
  return (
    <Fragment>
      <MetaData title={'Confirm Order'} />
      <CheckoutShop shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name:</b> {user && user.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b>{' '}
            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.coutry}`}
          </p>
          <hr />
          <h4 className="mt-4">Your Cart Item:</h4>
          {cartItems.map((item) => (
            <Fragment>
              <hr />
              <div className="cart-item my-1">
                <div className="row">
                  <div className="col-4 col lg-2">
                    <img src={item.image} alt="La" height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.qty} x ${item.price} =
                      <b> ${item.qty * item.price}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order-summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{' '}
              <span className="order-summary-values">${itemPrice}</span>
            </p>
            <p>
              Shipping:{' '}
              <span className="order-summary-values">${shippingPrice}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">${taxPrice}</span>
            </p>

            <hr />
            <p>
              Total: <span className="order-summary-values">${totalPrice}</span>
            </p>
            <hr />
            <button
              onClick={processToPayment}
              id="checkout_btn"
              className="btn btn-parimary btn-block"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
