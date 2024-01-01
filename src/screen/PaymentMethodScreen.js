import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import Colors from '../constants/Colors';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import * as onlinePaymentActions from '../store/actions/onlinePayment';
import * as codPaymentAction from '../store/actions/codPayment';
import RazorpayCheckout from 'react-native-razorpay';
import {URL} from '../constants/base_url';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {RAZORPAY_KEY} from '../constants/common';

const PaymentMethodScreen = ({navigation, route}) => {
  const service = route.params.service;
  const addressId = route.params.address_id;
  const date = route.params.date;
  const time = route.params.time;
  const cartTotal = route.params.cartTotal;
  const convenienceFee = route.params.convenienceFee;

  const [error, setError] = useState(null);
  const [paymentType, setPaymentType] = React.useState('cash');
  const [paymentLoader, setPaymentLoader] = React.useState(false);

  const {razorpay} = useSelector(state => state.request);

  const dispatch = useDispatch();
  const {Profile} = useSelector(state => state.user);

  const _submitOnlinePayment = async (order, paymentId, sign) => {
    setError(null);

    try {
      await dispatch(
        onlinePaymentActions.onlinePayment(
          service,
          date,
          time,
          addressId,
          cartTotal,
          paymentId,
          order,
          sign,
          convenienceFee,
        ),
      );
      Alert.alert('Alert', 'Booking has been placed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('PendingRequest')},
      ]);
    } catch (e) {
      setError(e.message);
    }
  };

  const _onlinePaymentHandler = async () => {
    setPaymentLoader(true);
    try {
      const options = {
        description: 'Pay For Booking',
        image: `${URL}public/images/settings/logo623950461c5a0.png`,
        currency: 'INR',
        key: RAZORPAY_KEY, // Your api key
        amount: razorpay.amount,
        name: Profile.name,
        order_id: razorpay.orderId,
        prefill: {
          email: Profile.email,
          contact: Profile.mobile,
          name: Profile.name,
        },
        theme: {color: '#F37254'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          _submitOnlinePayment(
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature,
          );
          setPaymentLoader(false);
        })
        .catch(error => {
          setPaymentLoader(false);
          const json = JSON.parse(error.description);
          Alert.alert('Alert', json.error.description);
        });
    } catch (e) {
      setError(e.message);
      setPaymentLoader(false);
    }
  };

  const paymentHandler = async () => {
    setPaymentLoader(true);
    if (paymentType === 'online') {
      await _onlinePaymentHandler();
      return false;
    }
    try {
      await dispatch(
        codPaymentAction.codPayment(
          service,
          date,
          time,
          addressId,
          cartTotal,
          convenienceFee,
        ),
      );
      Alert.alert('Alert', 'Booking has been placed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('PendingRequest')},
      ]);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (error) {
      return Alert.alert('Alert', error);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <View style={styles.method}>
        <Text style={styles.tax}>Choose Payment Method</Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <RadioButton
            value="cash"
            color={Colors.darkYellow}
            status={paymentType === 'cash' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('cash')}
          />
          <Pressable onPress={() => setPaymentType('cash')}>
            <Text>Cash On Delivery</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <RadioButton
            value="online"
            color={Colors.darkYellow}
            status={paymentType === 'online' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('online')}
          />
          <Pressable onPress={() => setPaymentType('online')}>
            <Text>Online Payment</Text>
          </Pressable>
        </View>
        <Button
          mode="contained"
          onPress={paymentHandler}
          style={{marginTop: RFValue(10)}}
          loading={paymentLoader}
          disabled={paymentLoader}
          labelStyle={{color: Colors.white}}>
          Proceed to Payment
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, marginHorizontal: 12},
  container: {
    marginVertical: RFValue(30),
  },
  head: {height: 28, backgroundColor: Colors.primary, opacity: 0.6},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  text: {textAlign: 'center'},
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tax: {
    fontWeight: 'bold',
  },
  method: {
    marginTop: RFValue(20),
  },
});

export default PaymentMethodScreen;
