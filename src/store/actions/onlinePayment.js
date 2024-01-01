import axios from 'axios';
import moment from 'moment';
export const ONLINE_PAYMENT = 'ONLINE_PAYMENT';
export const PAY_AFTER_COD = 'PAY_AFTER_COD';

export const onlinePayment = (
  service,
  date,
  time,
  addressId,
  total,
  paymentId,
  order,
  sign,
  convenienceFee,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('service', service);
    formData.append('date', moment(date).format('YYYY-MM-DD'));
    formData.append('time', time);
    formData.append('user_id', user_id);
    formData.append('address_id', addressId);
    formData.append('total', total);
    formData.append('razorpay_payment_id', paymentId);
    formData.append('razorpay_order_id', order);
    formData.append('razorpay_signature', sign);
    formData.append('convenience_fee', convenienceFee);

    const response = await axios.post('user/cart-after-payment', formData);

    if (response.data.status) {
      dispatch({
        type: ONLINE_PAYMENT,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const payAfterCOD = (bookingId, totalAmount, paymentId, order, sign) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('total', totalAmount);
    formData.append('razorpay_payment_id', paymentId);
    formData.append('razorpay_order_id', order);
    formData.append('razorpay_signature', sign);
    formData.append('booking_id', bookingId);

    const response = await axios.post('user/pay-after-cod', formData);

    if (response.data.status) {
      dispatch({
        type: PAY_AFTER_COD,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};
