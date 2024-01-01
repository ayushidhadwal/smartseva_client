import {
  GET_USER_PROFILE,
  GET_WALLET_TRANSACTIONS,
  GET_MESSAGE,
  SEND_MESSAGE,
  GENERATE_ORDER,
} from '../actions/user';

const initialState = {
  Profile: {
    name: '',
    email: '',
    username: '',
    password: '',
    photo: '',
    zip: 0,
    city: '',
    country: '',
    address: '',
    phone_code: '',
    mobile: '',
    country_name: '',
    city_name: '',
    wallet: '',
    referral_code: '',
    referPoints: 0,
  },
  TransactionList: [],
  getChats: [],
  OrderId: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PROFILE: {
      const data = action.Profile;
      return {
        ...state,
        Profile: {
          ...state.Profile,
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          photo: data.photo,
          zip: data.zip,
          address: data.address,
          phone_code: data.phone_code,
          mobile: data.mobile,
          country_name: data.country_name,
          city_name: data.city_name,
          wallet: data.wallet_user,
          referral_code: data.referral_code,
          city: data.city,
          country: data.country,
          referPoints: data.referral_points,
        },
      };
    }
    case GET_WALLET_TRANSACTIONS: {
      return {
        ...state,
        TransactionList: [...action.TransactionList],
      };
    }
    case GET_MESSAGE: {
      return {
        ...state,
        getChats: [...action.getChats],
      };
    }
    case SEND_MESSAGE: {
      const x = [...state.getChats];
      const ab = x.push({
        bookingid: action.bookingId,
        created_at: new Date(),
        id: null,
        message: action.input,
        name: null,
        photo: null,
        sender_id: action.senderId,
        type: 'user',
      });
      return {
        ...state,
        getChats: x,
      };
    }
    case GENERATE_ORDER: {
      return {
        ...state,
        OrderId: action.OrderId,
      };
    }
    default:
      return state;
  }
};
