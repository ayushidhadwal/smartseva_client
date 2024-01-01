import axios from 'axios';
import dayjs from 'dayjs';

export const SET_SERVICE_TYPE = 'SET_SERVICE_TYPE';
export const SET_SUB_SERVICE = 'SET_SUB_SERVICE';
export const SEARCHLIST = 'SEARCHLIST';
export const GET_TESTIMONIAL = 'GET_TESTIMONIAL';
export const ADD_TO_CART = 'ADD_TO_CART';
export const GET_CART = 'GET_CART';
export const DELETE_CART = 'DELETE_CART';
export const UPDATE_CART = 'UPDATE_CART';

export const setServiceType = () => {
  return async dispatch => {
    const response = await axios.get('main/get-services');
    dispatch({type: SET_SERVICE_TYPE, services: response.data.data});
  };
};
export const set_sub_service = serviceId => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const response = await axios.get(
      'main/get-sub-service-type/' + serviceId + '/' + user_id,
    );

    dispatch({type: SET_SUB_SERVICE, subServices: response.data.data});
  };
};
export const getSearch = search => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('search', search);

    const response = await axios.post('main/search-service', formData);

    if (response.data.result) {
      dispatch({type: SEARCHLIST, searchData: response.data.data});
    }
  };
};

export const getTestimonial = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);

    const response = await axios.get('user/get-rate-us');

    dispatch({type: GET_TESTIMONIAL, testimonial: response.data.data});
  };
};

export const addToCart = (serviceId, subServiceId) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('service_id', serviceId);
    formData.append('sub_service_id', subServiceId);
    formData.append('qty', 1);

    console.log(formData)

    await axios.post('user/add-to-cart', formData);
    dispatch({type: ADD_TO_CART});
  };
};

export const getCart = serviceId => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const response = await axios.get(`user/get-cart/${user_id}/${serviceId}`);

    dispatch({
      type: GET_CART,
      cart: {
        items: response.data.data.items,
        total: response.data.data.total,
        convenienceFees: response.data.data.convenience_fee,
      },
    });
  };
};

export const deleteCart = (cartId, price) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('cart_id', cartId);
    const response = await axios.post('user/delete-cart', formData);

    if (response.data.status) {
      dispatch({
        type: DELETE_CART,
        cartId,
        price,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateCart = (cartId, qty) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('cart_id', cartId.toString());
    formData.append('qty', qty.toString());

    const response = await axios.post('user/update-cart', formData);

    if (response.data.status) {
      dispatch({
        type: UPDATE_CART,
        cart: {
          items: response.data.data.items,
          total: response.data.data.total,
          convenienceFees: response.data.data.convenience_fee,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};
