import {
  SET_SERVICE_TYPE,
  SET_SUB_SERVICE,
  GET_TESTIMONIAL,
  SEARCHLIST,
  GET_CART,
  ADD_TO_CART,
  DELETE_CART,
  UPDATE_CART,
} from '../actions/home';

const initialState = {
  services: [],
  subServices: [],
  testimonial: [],
  searchData: [],
  cartList: {
    items: [],
    total: 0,
    convenienceFee: 0,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_TYPE: {
      return {
        ...state,
        services: [...action.services],
      };
    }
    case SET_SUB_SERVICE: {
      return {
        ...state,
        subServices: [...action.subServices],
      };
    }
    case SEARCHLIST: {
      return {
        ...state,
        searchData: [...action.searchData],
      };
    }
    case GET_TESTIMONIAL: {
      return {
        ...state,
        testimonial: [...action.testimonial],
      };
    }
    case ADD_TO_CART: {
      return {
        ...state,
      };
    }
    case GET_CART: {
      return {
        ...state,
        cartList: {
          items: action.cart.items,
          total: action.cart.total,
          convenienceFee: action.cart.convenienceFees,
        },
      };
    }
    case DELETE_CART: {
      const price = action.price;
      const cartId = action.cartId;
      const list = [...state.cartList.items];
      let cartPrice = [state.cartList.total];
      const findIndex = list.findIndex(list => list.id === cartId);

      if (findIndex > -1) {
        list.splice(findIndex, 1);
        cartPrice = cartPrice - price;
      }
      return {
        ...state,
        cartList: {
          items: list,
          total: cartPrice,
        },
      };
    }
    case UPDATE_CART: {
      return {
        ...state,
        cartList: {
          items: action.cart.items,
          total: action.cart.total,
          convenienceFee: action.cart.convenienceFees,
        },
      };
    }

    default:
      return state;
  }
};
