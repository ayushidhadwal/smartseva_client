import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  I18nManager,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Button, Divider, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Colors from '../../constants/Colors';

import {Row, Rows, Table} from 'react-native-table-component';
import I18n from '../../languages/I18n';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import timeList from '../../data/time';
import dayjs from 'dayjs';
import Entypo from 'react-native-vector-icons/Entypo';
import * as requestAction from '../../store/actions/request';
import {URL} from '../../constants/base_url';
import RazorpayCheckout from 'react-native-razorpay';
import * as onlinePaymentActions from '../../store/actions/onlinePayment';
import {RAZORPAY_KEY} from '../../constants/common';

const TextRow = ({heading, text, color}) => (
  <Text style={[styles.bold, {marginBottom: RFValue(5)}]}>
    {heading}:{' '}
    <Text style={[styles.normal, {color: color ? color : 'black'}]}>
      {text}
    </Text>
  </Text>
);

const PendingRequestDetailScreen = ({navigation, route}) => {
  const {Profile} = useSelector(state => state.user);
  const {serviceOrdered} = useSelector(state => state.request);
  const bookingId = route.params.bookingId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingLoader, setPendingLoading] = useState(true);
  const [paymentLoader, setPaymentLoader] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const _cancelRequestHandler = useCallback(async () => {
    try {
      await dispatch(requestAction.cancel_request(bookingId));
      setModalVisible(false);
      Alert.alert('Alert', 'Booking cancelled', [
        {text: 'OK', onPress: () => navigation.pop(4)},
      ]);
    } catch (e) {
      setError(e.message);
    }
  }, [bookingId, dispatch, navigation]);

  const _resheduleHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.getPendingReqDetail(bookingId, date, time));
      setModalVisible(false);
      Alert.alert('Alert', 'Service Request is Rescheduled Successfully', [
        {text: 'OK', onPress: () => navigation.pop(4)},
      ]);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [bookingId, date, dispatch, navigation, time]);

  const getBookingDetails = useCallback(async () => {
    setPendingLoading(true);
    try {
      await dispatch(requestAction.getOrderDetails(bookingId));
    } catch (e) {
      setError(e.message);
    }
    setPendingLoading(false);
  }, [bookingId, dispatch]);

  useEffect(() => {
    const focus = navigation.addListener('focus', getBookingDetails);
    return focus;
  }, [getBookingDetails, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const tableHead = [
    I18n.t('serviceTable'),
    I18n.t('priceTable'),
    I18n.t('totalTable'),
  ];

  const tableData = serviceOrdered.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹  ' + m.st_service_price,
    '₹  ' + m.st_service_price.toFixed(2),
  ]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = date => {
    hideDatePicker();
    setDate(date);
    setTime(time);
  };

  const _onlinePaymentHandler = async () => {
    setPaymentLoader(true);
    try {
      const options = {
        description: 'Pay For Booking',
        image: `${URL}public/images/settings/logo623950461c5a0.png`,
        currency: 'INR',
        key: RAZORPAY_KEY, // Your api key
        amount: serviceOrdered.booking_details.final_service_price,
        name: Profile.name,
        order_id: serviceOrdered.razorpayOrderId,
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

  const _submitOnlinePayment = async (order, paymentId, sign) => {
    setError(null);

    try {
      await dispatch(
        onlinePaymentActions.payAfterCOD(
          bookingId,
          serviceOrdered.booking_details.final_service_price,
          paymentId,
          order,
          sign,
        ),
      );
      Alert.alert('Alert', 'Payment has been placed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('PendingRequest')},
      ]);
    } catch (e) {
      setError(e.message);
    }
  };

  if (pendingLoader) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={date}
              isDarkModeEnabled={true}
            />

            <View style={styles.modalContainer}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{padding: RFValue(10)}}>
                <Entypo
                  name={'squared-cross'}
                  color={Colors.primary}
                  size={25}
                  style={styles.icon}
                />
              </Pressable>
              <View>
                <TextRow heading="Reschedule Request" />
              </View>

              <View style={{maxHeight: hp('50%')}}>
                <Pressable onPress={showDatePicker}>
                  <TextInput
                    left={
                      <TextInput.Icon name="calendar" color={Colors.grey} />
                    }
                    mode={I18nManager.isRTL ? 'outlined' : 'flat'}
                    maxLength={16}
                    label="Select Date"
                    minimumDate={new Date()}
                    value={date.toDateString()}
                    editable={false}
                    style={{
                      backgroundColor: 'white',
                      marginBottom: RFValue(10),
                    }}
                  />
                </Pressable>
                <FlatList
                  showsVerticalScrollIndicator={true}
                  data={timeList}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <Button
                      mode="outlined"
                      style={[
                        styles.btn,
                        item.time === time
                          ? {backgroundColor: 'rgba(34, 110, 160, 0.4)'}
                          : null,
                      ]}
                      contentStyle={{height: RFValue(45)}}
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
              </View>

              <Divider style={{marginVertical: RFValue(10)}} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onPress={_resheduleHandler}
                  uppercase={false}
                  color="green"
                  mode="contained">
                  {I18n.t('reqResch')}
                </Button>
                {serviceOrdered.booking_details.payment_type === 'COD' ? (
                  <Button
                    onPress={_cancelRequestHandler}
                    color="red"
                    mode="contained"
                    uppercase={false}>
                    {I18n.t('cancelBook')}
                  </Button>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>

        <View style={{flex: 1, padding: RFValue(12), backgroundColor: 'white'}}>
          <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
            {I18n.t('serviceDetails')}
          </Text>
          <Divider style={styles.marginVertical} />

          <>
            <TextRow
              heading={'Booking Id'}
              text={serviceOrdered.booking_details.booking_id}
            />
            <TextRow
              heading={'Service Name'}
              text={serviceOrdered.booking_details.service_name}
            />
            <TextRow
              heading={'Booking Date'}
              text={serviceOrdered.booking_details.booking_date}
            />
            <TextRow
              heading={'Booking Time'}
              text={serviceOrdered.booking_details.booking_time}
            />
          </>

          <View>
            <Text style={[styles.bold, {fontSize: RFValue(13)}]}>
              {I18n.t('details')} :
            </Text>
            <Divider style={styles.marginVertical} />
            <Table borderStyle={{borderWidth: 2, borderColor: Colors.primary}}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              <Rows data={tableData} textStyle={styles.text} />
              <Row
                data={[
                  'Convenience Fee',
                  '',
                  `+ ₹${serviceOrdered.booking_details.vat_amount}`,
                ]}
                textStyle={styles.text}
              />
              <Row
                data={[
                  'Total Amount',
                  '',
                  `₹${serviceOrdered.booking_details.final_service_price}`,
                ]}
                style={[styles.head]}
                textStyle={[styles.text]}
              />
            </Table>
            <Button
              icon="cancel"
              mode="contained"
              color="red"
              onPress={() => setModalVisible(true)}
              style={styles.button}>
              {I18n.t('cancelBtn')}
            </Button>
            {/*{serviceOrdered.booking_details.payment_type === 'COD' &&*/}
            {/*serviceOrdered.booking_details.status === 'ACCEPTED' ? (*/}
            {/*  <Button*/}
            {/*    mode="contained"*/}
            {/*    onPress={_onlinePaymentHandler}*/}
            {/*    style={[*/}
            {/*      styles.button,*/}
            {/*      {marginVertical: 0, backgroundColor: 'green'},*/}
            {/*    ]}*/}
            {/*    loading={paymentLoader}*/}
            {/*    disabled={paymentLoader}*/}
            {/*    labelStyle={{color: Colors.white}}>*/}
            {/*    Pay Now*/}
            {/*  </Button>*/}
            {/*) : null}*/}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  imgContainer: {
    height: hp('25%'),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  content: {
    padding: RFValue(10),
  },
  companyName: {
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: RFValue(15),
  },
  email: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: RFValue(15),
  },
  service_name: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    marginVertical: RFValue(5),
  },
  type: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: Colors.black,
  },
  time: {
    fontSize: RFValue(13),
    color: Colors.black,
  },
  type1: {
    fontSize: RFValue(13),
    color: Colors.black,
  },
  type2: {
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: 'red',
  },
  contactsContainer: {
    padding: RFValue(5),
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  normal: {
    fontWeight: 'normal',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  button: {
    marginHorizontal: RFValue(12),
    marginVertical: RFValue(30),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    marginHorizontal: RFValue(8),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: RFValue(12),
  },
  btn: {
    width: '45%',
    borderRadius: RFValue(5),
    marginBottom: RFValue(8),
    marginHorizontal: RFValue(9),
    backgroundColor: Colors.white,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: RFValue(10),
  },
  imgDesign: {
    width: RFValue(90),
    height: RFValue(90),
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
    borderWidth: 1 / 2,
    borderColor: '#cacbcc',
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  chatStyle: {
    width: '40%',
    alignSelf: 'flex-end',
    marginLeft: RFValue(10),
    marginTop: RFValue(10),
    borderRadius: RFValue(10),
  },
  invoiceStyle: {
    width: '40%',
    alignSelf: 'flex-end',
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
  },
  //
  head: {backgroundColor: 'rgba(238, 242, 40, 0.3)'},
  text: {margin: 6, fontSize: RFValue(11), textAlign: 'center'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  icon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default PendingRequestDetailScreen;
