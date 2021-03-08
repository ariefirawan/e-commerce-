import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';

import { UPDATE_PASSWORD_RESET } from '../../contants/userTypes';
import { clearErrors, forgotPassword } from '../../actions/userActions';

import MetaData from '../layout/MetaData';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const alert = useAlert();
  const dispatch = useDispatch();

  const { message, error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);

    }
  }, [dispatch, alert, error, message]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);

    dispatch(forgotPassword(formData));
  };
  return (
    <React.Fragment>
      <MetaData title="Forgot Password" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form action="" className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                className="form-control"
                id="email_field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="btn btn-block py-3"
              id="forgot_password_button"
              type="submit"
              disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
