import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';

import { UPDATE_PASSWORD_RESET } from '../../contants/userTypes';
import { clearErrors, updatePassword } from '../../actions/userActions';

import MetaData from '../layout/MetaData';

const UpdatePassword = ({ history }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, isUpdated, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success('Password Updated Successfully');

      history.push('/me');

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, history, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('password', newPassword);

    dispatch(updatePassword(formData));
  };
  return (
    <React.Fragment>
      <MetaData title="Change Password" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form action="" className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={loading ? true : false}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UpdatePassword;
