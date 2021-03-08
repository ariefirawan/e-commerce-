import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';

const Profile = () => {
  const { loading, user } = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        user && (
          <React.Fragment>
            <MetaData title={`Your Profile`} />
            <h2 className="mt-5 ml-5">My Profile</h2>
            <div className="row justify-content-around mt-5 user-info">
              <div className="col-12 col-md-3">
                <figure className="avatar avatar-profile">
                  <img
                    src={user.avatar.url}
                    alt={user.avatar.public_id}
                    className="rounded-circle img-fluid"
                  />
                </figure>
                <Link
                  to="/me/update"
                  className="btn btn-primary btn-block my-5"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="col-12 col-md-5">
                <h4>Full Name</h4>
                <p>{user.name}</p>

                <h4>Email </h4>
                <p>{user.email}</p>

                <h4>Joined On</h4>
                <p>{String(user.createdAt).substring(0, 10)}</p>

                {user.role !== 'admin' && (
                  <Link
                    to="/orders/me"
                    className="btn btn-danger btn-block mt-3"
                  >
                    My Orders
                  </Link>
                )}
                <Link
                  to="/password/update"
                  className="btn btn-primary btn-block mt-3"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default Profile;
