import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';

import { clearErrors, register } from '../../actions/userActions';

import MetaData from '../layout/MetaData';

const Register = ({ history }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(
    '/images/default_avatar.jpg'
  );

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatar', avatar);

    // console.log(user);

    dispatch(register(user));
  };

  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  return (
    <Fragment>
      <MetaData title="Register User" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>
            
            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Email</label>
              <input
                type="email"
                id="email_field"
                name="email"
                className="form-control"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                id='password_field'
                className="form-control"
                value={password}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      alt="avatar Preview"
                      className="rounded-circle"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    id="customFile"
                    className="custom-file-input"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label htmlFor="customFile" className="custom-file-label">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
