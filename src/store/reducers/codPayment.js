import {COD_PAYMENT} from '../actions/codPayment';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case COD_PAYMENT: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
