import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';

import { clearErrors, resetPassword } from '../../actions/userActions';

import MetaData from '../layout/MetaData';

const NewPassword = ({ history, match }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const alert = useAlert();
  const dispatch = useDispatch();

  const { success, error } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success('Password Update Successfully');
      history.push('/login');
    }
  }, [dispatch, alert, error, success, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    dispatch(resetPassword(match.params.token, formData));
  };
  return (
    <React.Fragment>
      <MetaData title="New Password Reset" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form action="" className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                className="form-control"
                id="password_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password_field">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirm-password_field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              id="new_password_field"
              type="submit"
              className="btn btn-block py-3"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewPassword;
