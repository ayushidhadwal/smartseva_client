import {ONLINE_PAYMENT, PAY_AFTER_COD} from '../actions/onlinePayment';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case ONLINE_PAYMENT: {
      return {
        ...state,
      };
    }

    case PAY_AFTER_COD: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
