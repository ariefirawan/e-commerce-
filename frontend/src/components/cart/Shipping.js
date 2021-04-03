import React, { Fragment, useState } from 'react';
import { countries } from 'countries-list';
import MetaData from '../layout/MetaData';
import CheckoutShop from './CheckoutShop';

import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../../actions/cartActions';

const Shipping = ({ history }) => {
  const coutriesList = Object.values(countries);
  const { shippingInfo } = useSelector((state) => state.cart);

  const [country, setCountry] = useState(shippingInfo.country);
  const [city, setCity] = useState(shippingInfo.city);
  const [address, setAddress] = useState(shippingInfo.address);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }));
    history.push('/order/confirm');
  };

  return (
    <Fragment>
      <MetaData title={'Shipping Info'} />

      <CheckoutShop shipping />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form action="" className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Shipping Info</h1>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="postal_code_field">Postal Code</label>
              <input
                type="number"
                id="postal_code_field"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="postal_code_field">Postal Code</label>
              <select
                id="country_field"
                className="form-control"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                required
              >
                {coutriesList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-primary btn-block"
            >
              Check out
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
