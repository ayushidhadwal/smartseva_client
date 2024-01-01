import {combineReducers} from 'redux';

import {LOGOUT} from './actions/auth';
import authReducer from './reducers/auth';
import homeReducer from './reducers/home';
import userReducer from './reducers/user';
import requestReducer from './reducers/request';
import addressReducer from './reducers/address';
import langReducer from './reducers/lang';
import codPaymentReducer from './reducers/codPayment';
import onlinePaymentReducer from './reducers/onlinePayment';

const appReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  user: userReducer,
  request: requestReducer,
  address: addressReducer,
  lang: langReducer,
  codPayment: codPaymentReducer,
  onlinePayment: onlinePaymentReducer,
});

export const RootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
