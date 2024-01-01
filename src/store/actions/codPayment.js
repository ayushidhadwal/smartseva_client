import axios from 'axios';
import moment from 'moment';
export const COD_PAYMENT = 'COD_PAYMENT';

export const codPayment = (
  serviceId,
  date,
  time,
  addressId,
  total,
  convenienceFee,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const formData = new FormData();
    formData.append('service', serviceId);
    formData.append('date', moment(date).format('YYYY-MM-DD'));
    formData.append('time', time);
    formData.append('user_id', user_id);
    formData.append('address_id', addressId);
    formData.append('total', total);
    formData.append('convenience_fee', convenienceFee);

    console.log(formData);

    const response = await axios.post('user/cart-for-cod', formData);

    if (response.data.status) {
      dispatch({
        type: COD_PAYMENT,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};
