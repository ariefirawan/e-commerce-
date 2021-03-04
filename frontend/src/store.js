import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productsReducer,
  productDetailReducer,
} from './Reducer/productReducer';

import { authReducer } from './Reducer/userReducer';

const reducer = combineReducers({
  products: productsReducer,
  productDetail: productDetailReducer,
  auth: authReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;