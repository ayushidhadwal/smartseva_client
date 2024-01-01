import {
  LOGIN,
  LOGOUT,
  SET_COUNTRIES,
  SET_CITIES,
  FORGOT_PASSWORD,
  VERIFY_OTP,
  REGISTER,
  SET_STATES,
} from '../actions/auth';

const initialState = {
  countries: [],
  states: [],
  cities: [],
  register: {
    mobileVerified: false,
    emailVerified: false,
    emailOTP: null,
    mobileOTP: null,
    mobileNumber: '',
    email: '',
    userId: '',
  },
  user_id: null,
  email: '',
  otp: 0,
  token: '',
  rUser_id: '',
  lat: 0,
  lang: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      return {
        ...state,
        register: {
          ...state.register,
          ...action.register,
        },
      };
    }
    // case REGISTER: {
    //   return {
    //     ...state,
    //     register: {
    //       ...state.register,
    //       register: {
    //         mobileVerified: action.mobileVerified,
    //         emailVerified: action.emailVerified,
    //         emailOTP: action.emailOTP,
    //         mobileOTP: action.mobileOTP,
    //         mobileNumber: action.mobileNumber,
    //         email: action.email,
    //       },
    //     },
    //   };
    // }
    case LOGIN: {
      return {
        ...state,
        user_id: action.userId,
      };
    }
    case FORGOT_PASSWORD: {
      return {
        ...state,
        email: action.email,
        otp: action.otp,
      };
    }
    case VERIFY_OTP: {
      return {
        ...state,
        token: action.token,
      };
    }
    case SET_COUNTRIES: {
      return {
        ...state,
        countries: [...action.countries],
      };
    }
    case SET_STATES: {
      return {
        ...state,
        states: [...action.states],
      };
    }
    case SET_CITIES: {
      return {
        ...state,
        cities: [...action.cities],
      };
    }
    case LOGOUT: {
      return {
        countries: [],
        cities: [],
        register: {
          mobileVerified: false,
          emailVerified: false,
          emailOTP: null,
          mobileOTP: null,
          mobileNumber: '',
          email: '',
          userId: '',
        },
        user_id: null,
        email: '',
        otp: 0,
        token: '',
      };
    }
    default:
      return state;
  }
};
