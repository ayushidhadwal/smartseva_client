import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Title } from 'react-native-paper';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

import timeList from '../data/time';
import Colors from '../constants/Colors';
import * as requestAction from '../store/actions/request';
import * as userActions from '../store/actions/user';
import { Loader } from '../components/common/Loader';
import I18n from '../languages/I18n';

const SlotBookingScreen = ({ navigation, route }) => {
  const service = route.params.service;
  const cartTotal = route.params.cartTotal;
  const address_id = route.params.address_id;
  const convenienceFee = route.params.convenienceFee;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(null);
  const [qty, setQty] = useState('1');

  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(60, 'days'),
    },
  ];

  const pickerSetDate = val => {
    setDate(val);
    setTime(null);
  };

  const _onSubmitHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.checkoutCart(service, date, time, address_id),
      );
      navigation.navigate('paymentMethod', {
        service,
        date,
        time,
        address_id,
        cartTotal,
        convenienceFee,
      });
    } catch (e) {
      if (e.message === 'Invalid User Address') {
        Alert.alert('', 'Service not available at your selected address', [
          {
            text: 'Change Address',
            onPress: () =>
              navigation.navigate('AddressList', {
                service: service,
                cartTotal: cartTotal,
                convenienceFee: convenienceFee,
              }),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      } else {
        setError(e.message);
      }
    }

    setIsLoading(false);
  }, [
    dispatch,
    service,
    date,
    time,
    address_id,
    navigation,
    cartTotal,
    convenienceFee,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(userActions.get_user_profile());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return () => unsubscribe;
  }, [dispatch, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        { text: 'OK', onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <Title style={styles.service}>{I18n.t('whenWould')}</Title>
      <CalendarStrip
        scrollable
        style={{ height: 100, paddingVertical: 5 }}
        markedDatesStyle={{
          backgroundColor: Colors.primary,
        }}
        selectedDate={date}
        datesWhitelist={datesWhitelist}
        startingDate={date}
        onDateSelected={e => pickerSetDate(e)}
        markedDates={[
          {
            date: date,
            dots: [
              {
                color: Colors.primary,
                selectedColor: Colors.primary,
              },
            ],
          },
        ]}
      />
      <View style={styles.demandRow}>
        <Ionicons
          name='time-outline'
          size={RFValue(24)}
        />
        <View style={styles.content1}>
          <Text style={styles.row}>{I18n.t('selectTime')} </Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={true}
        data={timeList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Button
            mode="outlined"
            style={[
              styles.btn,
              item.time === time
                ? { backgroundColor: 'rgba(238, 242, 40, 0.3)' }
                : null,
            ]}
            contentStyle={{ height: RFValue(45) }}
            onPress={() => setTime(item.time)}
            disabled={
              dayjs(date).format('ddd , DD MMM YYYY') ===
              dayjs(new Date()).format('ddd , DD MMM YYYY') &&
              item.time <= dayjs(new Date()).format('HH:mm')
            }>
            {item.time}
          </Button>
        )}
        numColumns={2}
      />
      <View style={styles.content2}>
        <Button
          mode="contained"
          style={styles.pay}
          onPress={_onSubmitHandler}
          loading={isLoading}
          disabled={isLoading || !time}>
          {I18n.t('contBtn')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: RFValue(8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    color: Colors.secondary,
    fontSize: RFValue(15),
    padding: RFValue(5),
    width: widthPercentageToDP('75%'),
  },
  service: {
    fontWeight: 'bold',
    padding: RFValue(15),
  },
  calenderRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  date: {
    fontSize: RFValue(13),
    color: Colors.grey,
    textAlign: 'center',
  },
  date1: {
    fontSize: RFValue(13),
    color: Colors.primary,
    textAlign: 'center',
  },
  demandRow: {
    backgroundColor: Colors.white,
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    marginBottom: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: RFValue(20),
    height: RFValue(25),
    marginTop: RFValue(5),
  },
  content1: {
    paddingLeft: RFValue(8),
    justifyContent: 'center',
  },
  row: {
    fontWeight: 'bold',
  },
  btn: {
    width: '45%',
    borderRadius: RFValue(5),
    marginBottom: RFValue(8),
    marginHorizontal: RFValue(9),
    backgroundColor: Colors.white,
  },
  content2: {
    padding: RFValue(10),
    paddingHorizontal: RFValue(20),
    backgroundColor: Colors.white,
    borderTopWidth: RFValue(0.5),
    borderColor: '#cccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pay: {
    flex: 1,
    alignSelf: 'center',
  },
  bookingDateContainer: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
    borderWidth: RFValue(1),
    borderColor: Colors.primary,
    borderRadius: RFValue(5),
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  bookingDate: {
    fontSize: RFValue(16),
  },
});

export const screenOptions = () => ({
  headerTitle: I18n.t('bookSlot'),
});

export default SlotBookingScreen;
