import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import { logoutUser } from '../../actions/userActions';

import Search from './Search';
import '../../App.css';

const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    alert.success('Logout Successfully');
  };
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            {/* <img src="./images/logo.png" /> */}
          </div>
        </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Route render={({ history }) => <Search history={history} />} />
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to='/cart' className='btn'>
            <span id="cart" className="mt-3">
              Cart
            </span>
          </Link>
          <span className="ml-1" id="cart_count">
            {cartItems.length}
          </span>
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                  <span>{user && user.name}</span>
                </figure>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>
                {user && user.role !== 'admin' ? (
                  <Link className="dropdown-item" to="/orders/me">
                    Orders
                  </Link>
                ) : (
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                )}

                <Link
                  to="/"
                  onClick={handleLogout}
                  className="dropdown-item text-danger"
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
