import axios from 'axios';
import {BASE_URL} from '../../constants/base_url';

export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_WALLET_TRANSACTIONS = 'GET_WALLET_TRANSACTIONS';
export const SET_PROFILE_PIC = 'SET_PROFILE_PIC';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const GENERATE_ORDER = 'GENERATE_ORDER';

export const updatePassword = (
  user_id,
  old_password,
  password,
  password_confirmation,
) => {
  return async dispatch => {
    if (!old_password) {
      throw new Error('Old Password is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (password.length < 5) {
      throw new Error(
        'The New Password field must be at least 6 characters in length.',
      );
    }
    if (!password_confirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.!');
    }
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('old_password', old_password);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios.post('user/update-password', formData);
    if (response.data.status) {
      dispatch({type: UPDATE_PASSWORD});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateProfile = (name, country_code, city_code) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    if (!name) {
      throw new Error('Your name is required!');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country_code);
    formData.append('city', city_code);
    formData.append('user_id', user_id);

    const response = await axios.post('user/update-profile', formData);

    if (response.data.status) {
      dispatch({type: UPDATE_PROFILE});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_user_profile = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get('user/get-profile/' + user_id);

    if (response.data.status) {
      dispatch({type: GET_USER_PROFILE, Profile: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_wallet_transactions = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get('user/get-wallet-transactions/' + user_id);

    dispatch({
      type: GET_WALLET_TRANSACTIONS,
      TransactionList: response.data,
    });
  };
};

export const updatePicture = image => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const form = new FormData();
    form.append('user_id', user_id);
    if (image.uri) {
      form.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type,
      });
    }

    const response = await axios.post('user/update-profile-picture', form);

    if (!response.data.status) {
      throw new Error(response.data.msg);
    } else {
      dispatch({type: SET_PROFILE_PIC});
      alert('Profile Picture Updated Successfully !!!');
    }
  };
};

export const sendMessage = (bookingId, text) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('booking_id', bookingId);
    form.append('message', text);

    const response = await axios.post('user/send-message', form);

    if (response.data.status) {
      dispatch({
        type: SEND_MESSAGE,
        input: text,
        bookingId: bookingId,
        senderId: user_id,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export function getMessage(bookingId, partnerId) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('booking_id', bookingId);
    form.append('partner_id', partnerId);

    const response = await axios.post('user/get-messages', form);

    if (response.data.status) {
      dispatch({type: GET_MESSAGE, getChats: response.data.data});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function Recharge(amt) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('amount', amt);

    const response = await axios.post('user/wallet-order-generate', form);

    if (response.data.status) {
      dispatch({
        type: GENERATE_ORDER,
        OrderId: response.data.data.id,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function onlineRecharge(amt, order, paymentId, sign) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('amount', amt);
    form.append('razorpay_order_id', order);
    form.append('razorpay_payment_id', paymentId);
    form.append('razorpay_signature', sign);

    const response = await axios.post(
      'user/verify-signature-for-wallet-recharge',
      form,
    );

    if (!response.data.status) {
      throw new Error(response.data.msg);
    }
  };
}
