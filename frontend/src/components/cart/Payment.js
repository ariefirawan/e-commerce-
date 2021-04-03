import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

import MetaData from '../layout/MetaData';
import CheckoutShop from './CheckoutShop';
import { saveShippingInfo } from '../../actions/cartActions';

const options = {
  style: {
    base: {
      fontSize: '16px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const Payment = ({ history }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {}, []);

  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector('#pay_btn').disabled = true;
    let res;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      res = await axios.post('/api/v1/payment/process', paymentData, config);
      const clientSecret = res.data.client_secret;

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
        document.querySelector('#pay_btn').disabled = false;
      } else {
        // the payment is processed or not
        if (result.paymentIntent.status === 'succeeded') {
          history.push('/success');
        } else {
          alert.error('There is some issues while payment processing');
        }
      }
    } catch (error) {
      document.querySelector('#pay_btn').disabled = false;
      alert.error(error.response.data.message);
    }
  };
  return (
    <Fragment>
      <MetaData title={'Payment'} />

      <CheckoutShop shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form action="" className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                className="form-control"
                id="card_num_field"
                options={options}
              />
            </div>
            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                className="form-control"
                id="card_exp_field"
                options={options}
              />
            </div>
            <div className="form-group">
              <label htmlFor="card_cvc_field">Card Number</label>
              <CardCvcElement
                type="text"
                className="form-control"
                id="card_cvc_field"
                options={options}
              />
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
