import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import {BASE_URL} from '../../constants/base_url';

export const GET_SERVICE_PROVIDER = 'GET_SERVICE_PROVIDER';
export const REQUEST_SERVICE = 'REQUEST_SERVICE';
export const GET_BOOKING = 'GET_BOOKING';
export const CANCEL_REQUEST = 'CANCEL_REQUEST';
export const POST_REVIEW = 'POST_REVIEW';
export const GET_SERVICE_PROVIDER_REVIEW = 'GET_SERVICE_PROVIDER_REVIEW';
export const GET_SERVICE_PROVIDER_PROFILE = 'GET_SERVICE_PROVIDER_PROFILE';
export const PAY_ORDER_DETAILS = 'PAY_ORDER_DETAILS';
export const PAY_FOR_ORDER = 'PAY_FOR_ORDER';
export const GET_COMPLETED_REQUEST = 'GET_COMPLETED_REQUEST';
export const RAISE_COMPLAINT = 'RAISE_COMPLAINT';
export const URGENT_SERVICES = 'URGENT_SERVICES';
export const RATE_US = 'RATE_US';
export const GET_PAYMENT_AMOUNT = 'GET_PAYMENT_AMOUNT';
export const RE_BOOKING = 'RE_BOOKING';
export const GET_BOOKING_DETAILS = 'GET_BOOKING_DETAILS';
export const PICTURES_OF_BOOKING = 'PICTURES_OF_BOOKING';
export const SET_SERVICE_CONFIRMATION = 'SET_SERVICE_CONFIRMATION';
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS';
export const GET_PENDING_REQ = 'GET_PENDING_REQ';
export const GET_PENDING_REQ_DETAIL = 'GET_PENDING_REQ_DETAIL';
export const CART_CHECKOUT = 'CART_CHECKOUT';
export const GET_COMPLAINT_TYPES = 'GET_COMPLAINT_TYPES';

export const get_service_provider = ({
  service,
  sub_service,
  date,
  time,
  user_id,
  qty,
  address_id,
}) => {
  return async dispatch => {
    if (!date) {
      throw new Error('Date is required!');
    }

    if (time === null) {
      throw new Error('Please select time slot!');
    }

    if (!qty || Number(qty) <= 0) {
      throw new Error('Please select time slot!');
    }

    const formData = new FormData();
    formData.append('service', service);
    formData.append('sub_service', sub_service);
    formData.append('date', dayjs(date).format('YYYY-MM-DD'));
    formData.append('time', time);
    formData.append('user_id', user_id);
    formData.append('qty', Number(qty).toString());
    formData.append('address_id', address_id);

    const response = await axios.post(
      'main/service-provider-available',
      formData,
    );

    if (response.data.result) {
      dispatch({
        type: GET_SERVICE_PROVIDER,
        payData: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const request_service = (
  partner_id,
  service_id, // array
  booking_date,
  booking_time,
  service_price, // array
  qty, // array
  final_service_price,
  address_id,
  instructions,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const serviceId = JSON.stringify(service_id);
    const q = JSON.stringify(qty);
    const price = JSON.stringify(service_price);

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('partner_id', partner_id.toString());
    formData.append('service_id', serviceId);
    formData.append('booking_date', booking_date);
    formData.append('booking_time', booking_time);
    formData.append('service_price', price);
    formData.append('qty', q);
    formData.append('final_service_price', final_service_price.toString());
    formData.append('address_id', address_id);
    formData.append('comment', instructions);

    const response = await axios.post('user/request-service', formData);

    if (response.data.status) {
      dispatch({
        type: REQUEST_SERVICE,
        bookingId: response.data.data.booking_id,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_booking = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);

    const response = await axios.post('user/get-booking', formData);



    dispatch({type: GET_BOOKING, bookingList: response.data.html});
  };
};

export const get_pending_req = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get(`user/get-pending-request/${user_id}`);


    if (!response.data.result) {
      throw new Error(response.data.msg);
    } else {
      dispatch({type: GET_PENDING_REQ, pendingList: response.data.data});
    }
  };
};

export const getPendingReqDetail = (bookingId, date, time) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('booking_id', bookingId);
    formData.append('date', moment(date).format('YYYY-MM-DD'));
    formData.append('time', time);

    const response = await axios.post('user/rescheduling-booking', formData);

    if (response.data.status) {
      dispatch({
        type: GET_PENDING_REQ_DETAIL,
        pendingReqDetail: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const cancel_request = booking_id => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('booking_id', booking_id);

    const response = await axios.post('user/cancel-request', formData);

    if (response.data.status) {
      dispatch({type: CANCEL_REQUEST, booking_id});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const post_review = (
  message,
  image,
  service,
  money,
  behaviour,
  partner_id,
  booking_id,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    if (!message) {
      throw new Error('Message Field must be Filled.');
    }
    if (!service) {
      throw new Error('Please rate our services out of 5.');
    }
    if (!money) {
      throw new Error('Please rate value for money out of 5.');
    }
    if (!behaviour) {
      throw new Error('Please rate the behaviour out of 5. ');
    }
    if (service > 5 || money > 5 || behaviour > 5) {
      throw new Error('Ratings must be out of 5');
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('message', message);
    if (image) {
      formData.append('image', {
        name: 'image.jpg',
        uri: image,
        type: 'image/jpeg',
      });
    }

    formData.append('services', service);
    formData.append('value_for_money', money);
    formData.append('behaviour', behaviour);
    formData.append('partner_id', partner_id);
    formData.append('booking_id', booking_id);

    const response = await axios.post('user/post-review', formData);

    if (response.data.result) {
      dispatch({type: POST_REVIEW});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_service_provider_review = partner_id => {
  return async dispatch => {
    const response = await axios.get(
      'main/get-service-provider-review/' + partner_id,
    );

    dispatch({
      type: GET_SERVICE_PROVIDER_REVIEW,
      providerReview: response.data.data,
    });
  };
};

export const get_service_provider_profile = (
  partner_id,
  bookingDate,
  bookingTime,
  qty,
  address_id,
  serviceId,
) => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('partner_id', partner_id);
    formData.append('date', bookingDate);
    formData.append('time', bookingTime);
    formData.append('qty', qty);
    formData.append('address_id', address_id);
    formData.append('service_id', serviceId);
    const response = await axios.post(
      'main/get-service-provider-profile',
      formData,
    );

    dispatch({
      type: GET_SERVICE_PROVIDER_PROFILE,
      providerProfile: response.data.data,
      providerProfile_data: response.data.data.profile,
    });
  };
};

export const setPayOrderDetails = bookingId => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('booking_id', bookingId);
    const response = await axios.post('user/pay-order-detail', formData);
    dispatch({
      type: PAY_ORDER_DETAILS,
      payOrderDetails: response.data.data,
    });
  };
};

export const pay_for_order = (
  pay_amount,
  wallet_check,
  pay_from_wallet = 0,
  refund_wallet_check,
  pay_from_refund_wallet = 0,
  booking_id,
  total_amount,
  vat_amount,
  cardNumber,
  month,
  year,
  cvv,
  payment_method,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    if (!cardNumber) {
      throw new Error('Invalid Card Number!');
    }
    if (!month) {
      throw new Error('Invalid Expiration Month!');
    }
    if (!year) {
      throw new Error('Invalid Expiration Year!');
    }
    if (!cvv) {
      throw new Error('Invalid CVV/CVC!');
    }

    const formData = new FormData();
    formData.append('pay_amount', pay_amount);
    formData.append('wallet_check', wallet_check);
    formData.append('pay_from_wallet', pay_from_wallet);
    formData.append('refund_wallet_check', refund_wallet_check);
    formData.append('pay_from_refund_wallet', pay_from_refund_wallet);
    formData.append('booking_id', booking_id);
    formData.append('total_amount', total_amount);
    formData.append('vat_amount', vat_amount);
    formData.append('user_id', user_id);
    formData.append('card_no', cardNumber);
    formData.append('ccExpiryMonth', month);
    formData.append('ccExpiryYear', year);
    formData.append('cvvNumber', cvv);
    formData.append('payment_method', payment_method);

    const response = await axios.post('user/payForOrder', formData);

    if (response.data.status) {
      dispatch({type: PAY_FOR_ORDER});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getCompletedRequest = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);

    const response = await axios.post('user/get-completed-request', formData);

    dispatch({
      type: GET_COMPLETED_REQUEST,
      completedRequest: response.data.html,
    });
  };
};

export const raise_complaint = (partner_id, booking_id, subject, comment) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('partner_id', partner_id);
    formData.append('booking_id', booking_id);
    formData.append('subject', subject);
    formData.append('comment', comment);

    const response = await axios.post('user/raise-complaint', formData);

    if (response.data.status) {
      dispatch({type: RAISE_COMPLAINT});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const rate_us = (service, message) => {
  return async (dispatch, getState) => {
    if (service === 0) {
      throw new Error('Rating is required!');
    }

    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('rating', service);
    form.append('comment', message);

    const response = await axios.post('user/rate-us', form);

    if (response.data.status) {
      dispatch({type: RATE_US});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const urgentServices = (complaint, image, comment) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('description', comment);
    form.append('user_type', 'USER');
    form.append('type', complaint);
    if (image) {
      form.append('file', {
        name: 'image.jpg',
        uri: image,
        type: 'image/jpeg',
      });
    }

    const response = await axios.post('user/urgent-services', form);

    if (response.data.status) {
      dispatch({type: URGENT_SERVICES});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getPaymentAmount = (
  bookingId,
  total,
  refundWalletChecked,
  walletChecked,
) => {
  return async dispatch => {
    const form = new FormData();
    form.append('booking_id', bookingId);
    form.append('total_price', total);
    form.append('check_refund_wallet', refundWalletChecked ? 'yes' : '');
    form.append('check_wallet', walletChecked ? 'yes' : '');

    const response = await axios.post('user/get-payment-amount', form);
    if (response.data.status) {
      dispatch({
        type: GET_PAYMENT_AMOUNT,
        // gatewayData: response.data.data,
        // bookingId,
        paymentAmountDetails: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export function rescheduleBooking(booking_id, partnerId, booking_date, time) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();

    form.append('user_id', user_id);
    form.append('partner_id', partnerId);
    form.append('booking_id', booking_id);
    form.append('booking_date', booking_date);
    form.append('booking_time', time);

    const response = await axios.post('user/rescheduling-service', form);

    if (response.data.status) {
      dispatch({type: RE_BOOKING});
    } else {
      throw new Error(response.data.msg);
    }
  };
}
export function getCompleteServicePictures(booking_id) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('booking_id', booking_id);

    const response = await axios.post(
      'user/get-complete-booking-pictures',
      form,
    );

    if (response.data.status) {
      dispatch({type: PICTURES_OF_BOOKING, pictures: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function setServiceConfirmation(booking_Id, checked, reason, img) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('service_confirmation', checked);
    form.append('booking_id', booking_Id);
    form.append('reason', reason);

    img.forEach((i, c) => {
      form.append(`image${c}`, {
        name: i.name,
        uri: i.uri,
        type: i.type,
      });
    });

    const response = await axios({
      method: 'post',
      url: 'user/service-confirmation',
      data: form,
    });

    if (response.data.status) {
      dispatch({type: SET_SERVICE_CONFIRMATION});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function getOrderDetails(booking_id) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    // alert(user_id);


    const form = new FormData();
    form.append('user_id', user_id);
    form.append('booking_id', booking_id);

    const response = await axios.post('user/get-booking-details', form);
    console.log('response',response.data);

    if (response.data.status) {

      dispatch({
        type: GET_ORDER_DETAILS,
        serviceOrdered: response.data.data,
        razorpay: response.data.data.razor.id,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function checkoutCart(serviceId, date, time, addressId) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('service', serviceId);
    form.append('date', `${moment(date).format('YYYY-MM-DD')}`);
    form.append('time', time);
    form.append('address_id', addressId);

    const response = await axios.post('user/checkout-cart', form);

    if (response.data.status) {
      dispatch({
        type: CART_CHECKOUT,
        razor: {
          orderId: response.data.data.razor.id,
          amount: response.data.data.razor.amount,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export const getComplaintTypes = () => {
  return async (dispatch, getState) => {
    const response = await axios.get('get-complaint-types');

    dispatch({
      type: GET_COMPLAINT_TYPES,
      complaintList: response.data.data,
    });
  };
};
