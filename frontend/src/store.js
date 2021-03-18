import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productsReducer,
  productDetailReducer,
} from './Reducer/productReducer';

import {
  authReducer,
  userReducer,
  forgotPasswordReducer,
} from './Reducer/userReducer';

import { cartReducer } from './Reducer/cartReducer';

const reducer = combineReducers({
  products: productsReducer,
  productDetail: productDetailReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
