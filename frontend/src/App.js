import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetail from './components/product/ProductDetail';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import ProtectedRoutes from './components/route/ProtectedRoutes';

import { loadUser } from './actions/userActions';
import store from './store';
// import './App.css';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetail} exact />

          <Route path="/cart" component={Cart} exact />

          <Route path="/register" component={Register} exact />
          <Route path="/login" component={Login} />
          <Route path="/password/forgot" component={ForgotPassword} />
          <Route path="/password/reset/:token" component={NewPassword} />
          <ProtectedRoutes path="/me" component={Profile} exact />
          <ProtectedRoutes path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoutes
            path="/password/update"
            component={UpdatePassword}
            exact
          />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
