import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, View} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import * as userActions from '../../src/store/actions/user';
import {URL} from '../constants/base_url';
import {RAZORPAY_KEY} from '../constants/common';

const PaymentScreen = ({navigation, route}) => {
  const amt = route.params.amt;
  const {OrderId, Profile} = useSelector(state => state.user);

  const [onlineLoading, setOnlineLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const _submitOnlinePayment = useCallback(
    async (order, paymentId, sign) => {
      setOnlineLoading(true);
      setError(null);
      try {
        await dispatch(userActions.onlineRecharge(amt, order, paymentId, sign));
        await dispatch(userActions.get_user_profile());
        setOnlineLoading(false);
        Alert.alert('Alert', 'Recharge Successfully Done.', [
          {text: 'OK', onPress: () => navigation.pop(3)},
        ]);
      } catch (e) {
        setError(e.message);
      }
      setOnlineLoading(false);
    },
    [amt, dispatch, navigation],
  );

  const _onlinePaymentHandler = useCallback(async () => {
    try {
      const options = {
        description: 'Recharge Wallet.',
        image: `${URL}public/images/settings/logo623950461c5a0.png`,
        currency: 'INR',
        key: RAZORPAY_KEY, // Your api key
        amount: amt,
        name: Profile.name,
        order_id: OrderId,
        prefill: {
          email: Profile.email,
          contact: Profile.mobile,
          name: Profile.name,
        },
        theme: {color: '#f5b942'},
      };

      RazorpayCheckout.open(options)
        .then(data => {
          _submitOnlinePayment(
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature,
          );
        })
        .catch(error => {
          const json = JSON.parse(error.description);
          Alert.alert('Alert', json.error.description, [
            {text: 'OK', onPress: () => navigation.navigate('Recharge')},
          ]);
        });
    } catch (e) {
      setError(e.message);
      setOnlineLoading(false);
    }
  }, [
    OrderId,
    Profile.email,
    Profile.mobile,
    Profile.name,
    _submitOnlinePayment,
    amt,
    navigation,
  ]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await _onlinePaymentHandler();
    });
    return unsubscribe;
  }, [navigation, _onlinePaymentHandler]);

  return <View />;
};

export default PaymentScreen;
