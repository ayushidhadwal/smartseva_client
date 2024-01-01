import axios from 'axios';
import {Address} from '../../models/Address';

export const SET_ADDRESSES = 'SET_ADDRESSES';
export const SET_SINGLE_ADDRESSES = 'SET_SINGLE_ADDRESSES';
export const SET_DEFAULT_ADDRESS = 'SET_DEFAULT_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const SET_NEW_ADDRESS = 'SET_NEW_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';

export const setAddresses = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);

    const response = await axios.post('user/get-all-address', formData);

    if (response.data.status) {
      dispatch({type: SET_ADDRESSES, addresses: response.data.data.address});
      console.log(response.data.data)
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setSingleAddress = addressId => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('address_id', addressId);

    const response = await axios.post('user/get-address-details', formData);

    if (response.data.status) {
      const {
        id,
        user_name,
        user_address,
        user_country,
        user_city,
        user_phone_code,
        user_phone_number,
        default_add,
      } = response.data.data.address;
      dispatch({
        type: SET_SINGLE_ADDRESSES,
        address: new Address(
          id,
          user_name,
          user_address,
          user_country,
          user_city,
          user_phone_code,
          user_phone_number,
          default_add,
        ),
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setDefaultAddress = addressId => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('address_id', addressId);

    const response = await axios.post('user/set-default-address', formData);

    if (response.data.status) {
      dispatch({
        type: SET_DEFAULT_ADDRESS,
        addressId,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateAddress = (
  addressId,
  address,
  country,
  city,
  name,
  phoneCode,
  phoneNumber,
  isDefault,
) => {
  return async (dispatch, getState) => {
    const {user_id, countries, cities} = getState().auth;

    const err = [];
    if (!address) {
      err.push('Address is required!');
    }
    if (!country) {
      err.push('Country is required!');
    }
    if (!city) {
      err.push('City is required!');
    }
    if (!name) {
      err.push('Name is required!');
    }
    if (!phoneNumber) {
      err.push('Phone Number is required!');
    }

    if (err.length !== 0) {
      throw new Error(err.join('\n'));
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('address', address);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('user_name', name);
    formData.append('phone_code', phoneCode);
    formData.append('phone_number', phoneNumber);
    formData.append('address_id', addressId);

    const response = await axios.post('user/update-address', formData);

    if (response.data.status) {
      dispatch({
        type: UPDATE_ADDRESS,
        countries: countries,
        cities: cities,
        address: new Address(
          addressId,
          name,
          address,
          country,
          city,
          phoneCode,
          phoneNumber,
          isDefault,
        ),
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setNewAddress = (
  address,
  state,
  city,
  name,
  phoneCode,
  phoneNumber,
  latitude,
  longitude,
  flat,
  area,
  pincode,
) => {
  return async (dispatch, getState) => {
    const {user_id, cities, states} = getState().auth;

    const err = [];
    if (!address) {
      err.push('Address is required!');
    }
    if (!name) {
      err.push('State is required!');
    }
    if (!city) {
      err.push('City is required!');
    }
    if (!name) {
      err.push('Name is required!');
    }
    if (!phoneNumber) {
      err.push('Phone Number is required!');
    }
    if (!latitude || !longitude) {
      err.push('Allow access your location');
    }

    if (err.length !== 0) {
      throw new Error(err.join('\n'));
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('address', address);
    formData.append('country', 101);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('user_name', name);
    formData.append('phone_code', phoneCode);
    formData.append('phone_number', phoneNumber);
    formData.append('lat', latitude);
    formData.append('long', longitude);
    formData.append('user_area', area);
    formData.append('flat', flat);
    formData.append('user_pincode', pincode);

    const response = await axios.post('user/add-address', formData);

    if (response.data.status) {
      const stateName = states.find(c => parseInt(c.id) === parseInt(state));
      const cityName = cities.find(c => parseInt(c.id) === parseInt(city));

      dispatch({
        type: SET_NEW_ADDRESS,
        address: new Address(
          response.data.data.id,
          name,
          address,
          stateName.name,
          cityName.name,
          phoneCode,
          phoneNumber,
          response.data.data.default_add,
        ),
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const deleteAddress = addressId => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('address_id', addressId);

    const response = await axios.post('user/delete-address', formData);

    if (response.data.status) {
      dispatch({
        type: DELETE_ADDRESS,
        addressId: addressId,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};
