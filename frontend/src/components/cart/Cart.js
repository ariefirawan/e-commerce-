import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { addItemToCart, removeItemCart } from '../../actions/cartActions';

import MetaData from '../layout/MetaData';

const Cart = ({history}) => {
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const increaseQty = (id, qty, stock) => {
    const newQty = qty + 1;

    if (newQty > stock) return;

    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQty = (id, qty) => {
    const newQty = qty - 1;

    if (newQty < 1) return;

    dispatch(addItemToCart(id, newQty));
  };

  const deleteHandler = (id) => {
    dispatch(removeItemCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <React.Fragment>
      <MetaData title={'Your Cart'} />
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your cart is empty</h2>
      ) : (
        <React.Fragment>
          <h2 className="mt-5">
            Your Cart: <b>2 items</b>
          </h2>
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              <hr />
              {cartItems.map((item) => (
                <React.Fragment>
                  <hr />

                  <div key={item.product} className="cart-item">
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt="laptop"
                          height="90"
                          width="115"
                        />
                        <div className="col-5 col-lg-3">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 ml-lg-0">
                          <p>${item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-3 mt-4 mt-lg 0">
                          <div className="stockCounter d-inline">
                            <span
                              type="button"
                              className="btn-btn-danger minus"
                              onClick={() =>
                                decreaseQty(item.product, item.qty)
                              }
                            >
                              -
                            </span>
                            <input
                              value={item.qty}
                              readOnly
                              className="form-control count d-inline"
                            />
                            <span
                              className="btn btn-primary-plus"
                              onClick={() =>
                                increaseQty(item.product, item.qty, item.stock)
                              }
                            >
                              +
                            </span>
                          </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                          <i
                            className="fa fa-trash btn btn-danger"
                            onClick={() => deleteHandler(item.product)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="col-12 col-lg-3-my 4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{' '}
                  <span className="order-summary-values">
                    {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}{' '}
                    (Units)
                  </span>
                </p>
                <p>
                  Est. total:
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + item.qty * item.price,
                      0
                    )}
                  </span>
                </p>

                <hr />
                <button id="checkout_btn" className="btn btn-primary" onClick={checkoutHandler}>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Cart;
