import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getNotificationToken } from '../../lib/Notifee';

export const SESSION_ID = '@SMARTSEVA:userId';
export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_COUNTRIES = 'SET_COUNTRIES';
export const SET_CITIES = 'SET_CITIES';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const VERIFY_OTP = 'VERIFY_OTP';
export const SET_NEW_PASSWORD = 'SET_NEW_PASSWORD';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_STATES = 'SET_STATES';

export const auth = userId => {
  return {type: LOGIN, userId: userId};
};

export const logout = () => {
  return async dispatch => {
    dispatch({type: LOGOUT});
    await AsyncStorage.removeItem(SESSION_ID);
  };
};

export const login = ({email, password}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('token', token);

    const response = await axios.post('user/login', formData);

    if (response.data.result) {
      const {
        otp,
        mobile_otp,
        email,
        mobile,
        mobile_verified,
        email_verified,
        user_id,
      } = response.data.data;

      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            emailOTP: otp,
            mobileOTP: mobile_otp,
            mobileNumber: mobile,
            email: email,
            userId: user_id,
          },
        });
      }
    } else if (response.data.errors) {
      throw new Error(response.data.errors);
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const register = ({
  name,
  email,
  password,
  confirmPassword,
  phoneCode,
  mobile,
}) => {
  return async dispatch => {
    if (!name) {
      throw new Error('Your name is required!');
    }

    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    if (!confirmPassword) {
      throw new Error('Confirm Password is required!');
    }

    if (!phoneCode) {
      throw new Error('Phone Code is required!');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords must be same!');
    }

    const token = await getNotificationToken();
    console.log(token)

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    // formData.append('country', '');
    // formData.append('city', '');
    // formData.append('code', '');
    // formData.append('state', '');
    formData.append('token', token);

    const response = await axios.post('user/register', formData);

    if (response.data.result) {
      const {otp, mobile_otp, email, mobile, mobile_verified, email_verified} =
        response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          emailOTP: otp,
          mobileOTP: mobile_otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else if (response.data.errors.email) {
      throw new Error(response.data.errors.email);
    } else if (response.data.errors.mobile) {
      throw new Error(response.data.errors.mobile);
    } else {
      throw new Error(response.data.errors.email + response.data.errors.mobile);
    }
  };
};

export const setCountries = () => {
  return async dispatch => {
    const response = await axios.get('main/get-countries');

    dispatch({type: SET_COUNTRIES, countries: response.data.data});
  };
};

export const setStates = () => {
  return async dispatch => {
    const response = await axios.get('main/get-states/101');

    dispatch({type: SET_STATES, states: response.data.data});
  };
};

export const setCities = countryId => {
  return async dispatch => {
    const response = await axios.get(`main/get-cities/${countryId}`);
    dispatch({type: SET_CITIES, cities: response.data.data});
  };
};

export const forgotPassword = ({email}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post('user/send-otp', formData);

    if (response.data.result) {
      dispatch({
        type: FORGOT_PASSWORD,
        email: response.data.email,
        otp: response.data.otp,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationEmailOtp = email => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post('user/send-otp-again', formData);

    if (response.data.result) {
      const {otp, email, mobile, mobile_verified, email_verified} =
        response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          emailOTP: otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationMobileOtp = mobile => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);

    const response = await axios.post('user/send-mobile-otp-again', formData);

    if (response.data.result) {
      const {mobile_otp, email, mobile, mobile_verified, email_verified} =
        response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          mobileOTP: mobile_otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyUserEmail = (email, otp) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);

    const response = await axios.post(
      'user/verify-user-registration',
      formData,
    );

    if (response.data.result) {
      const {mobile_verified, email_verified, mobile, email} =
        response.data.data;
      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            mobileNumber: mobile,
            email: email,
          },
        });
      }
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyUserMobile = (mobile, otp) => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);

    const response = await axios.post(
      'user/verify-mobile-user-registration',
      formData,
    );

    if (response.data.result) {
      const {mobile_verified, email_verified, mobile, email} =
        response.data.data;
      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            mobileNumber: mobile,
            email: email,
          },
        });
      }
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyOtp = ({email, userOTP}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }
    if (!userOTP) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', userOTP);

    const response = await axios.post('user/verify-otp', formData);

    if (response.data.result) {
      dispatch({
        type: VERIFY_OTP,
        token: response.data.token,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const set_new_password = ({token, password, password_confirmation}) => {
  return async dispatch => {
    if (password.length < 6) {
      throw new Error('Password must contain 6 letters');
    }
    if (!password || !password_confirmation) {
      throw new Error('Fields must be filled!');
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.');
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios.post('user/forgot-password-update', formData);

    if (response.data.result) {
      dispatch({
        type: SET_NEW_PASSWORD,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};