import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  FlatList,
  I18nManager,
} from 'react-native';
import {Button, Divider, Subheading, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

import Colors from '../constants/Colors';
import * as requestAction from '../store/actions/request';
import timeList from '../data/time';
import JobDescription from '../components/JobDescription';
import {Row, Rows, Table} from 'react-native-table-component';
import I18n from '../languages/I18n';
import SMARTSEVA_LOGO from '../../assets/icon.png';
import {PROVIDER_LOGO, URL} from '../constants/base_url';
import RazorpayCheckout from 'react-native-razorpay';
import * as onlinePaymentActions from '../store/actions/onlinePayment';
import {RAZORPAY_KEY} from '../constants/common';

const TextRow = ({heading, text, color}) => (
  <Text style={[styles.bold, {marginBottom: RFValue(5)}]}>
    {heading}:{' '}
    <Text style={[styles.normal, {color: color ? color : 'black'}]}>
      {text}
    </Text>
  </Text>
);

const RequestDetailScreen = ({navigation, route}) => {
  const {booking_id} = route.params.providerDetails;

  const {serviceOrdered, razorpay} = useSelector(state => state.request);

  const tableHead = [I18n.t('serviceTable'), I18n.t('totalTable')];
  const tableData = serviceOrdered.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹  ' + m.st_service_price.toFixed(2),
  ]);
  const {Profile} = useSelector(state => state.user);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [reLoading, setReLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState({
    provider_img: '',
    company_name: '',
    provider_email: '',
    service_name: '',
    sub_service_name: '',
    booking_date_time: '',
    service_price: '',
    service_status: '',
    provider: '',
    provider_mobile: '',
    provider_phonecode: '',
    total_price: '',
    payment_status: '',
    reject_reason: '',
    review_status: '',
    qty: '',
  });

  // console.log(booking);
  const [modalVisible, setModalVisible] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = date => {
    hideDatePicker();
    setDate(date);
    setTime(null);
  };

  const {
    provider_img,
    company_name,
    provider_email,
    service_name,
    sub_service_name,
    booking_date_time,
    service_price,
    service_status,
    provider,
    provider_mobile,
    provider_phonecode,
    total_price,
    payment_status,
    reject_reason,
    review_status,
    qty,
  } = booking;

  console.log(' total_price', total_price)

  const dispatch = useDispatch();
  const {bookingList} = useSelector(state => state.request);


  useEffect(() => {
    const b = bookingList.find(b => b.booking_id === booking_id);
    if (bookingList) {
      setBooking({
        ...b,
      });
      setStatus(b.service_status);
      setModalVisible(b.service_status === 'RESCHEDULE');
    }
  }, [bookingList, booking_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_booking());
        await dispatch(requestAction.getOrderDetails(booking_id));
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return () => unsubscribe;
  }, [booking_id, dispatch, navigation]);

  const _cancelRequestHandler = useCallback(async () => {
    Alert.alert(I18n.t('alertReqTitle'), I18n.t('alertReqMsg'), [
      {
        text: 'Yes',
        onPress: async () => {
          setLoading(true);
          setError(null);

          try {
            await dispatch(requestAction.cancel_request(booking_id));
            setStatus('CANCELLED');
          } catch (e) {
            setError(e.message);
          }
          setLoading(false);
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }, [dispatch, booking_id]);

  const _rescheduleBooking = async () => {
    setReLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.rescheduleBooking(
          booking_id,
          provider,
          dayjs(date).format('YYYY-MM-DD'),
          time,
        ),
      );
      setModalVisible(false);
      setStatus('PENDING');
    } catch (e) {
      setError(e.message);
    }
    setReLoading(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _onlinePaymentHandler = async () => {
    // console.log('amount',serviceOrdered.booking_details.final_service_price);
    // return;
    setPaymentLoader(true);

    console.log('id',serviceOrdered.razorpayOrderId);

    try {
      const options = {
        description: 'Pay For Booking',
        image: `${URL}public/images/settings/logo623950461c5a0.png`,
        currency: 'INR',
        key: RAZORPAY_KEY, // Your api key
        amount: serviceOrdered.booking_details.final_service_price*100,
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
          booking_id,
          serviceOrdered.booking_details.final_service_price,
          paymentId,
          order,
          sign,
        ),
      );
      Alert.alert('Alert', 'Payment has been placed successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
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
              <View>
                <Subheading style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {I18n.t('bookResch')}
                </Subheading>
                <Divider style={{marginVertical: RFValue(5)}} />
                <TextRow
                  heading="Rejected Request Reason"
                  text={reject_reason}
                />
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

              <Divider style={{marginVertical: RFValue(5)}} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onPress={_rescheduleBooking}
                  uppercase={false}
                  color="green"
                  mode="contained"
                  loading={reLoading}
                  disabled={reLoading}>
                  {I18n.t('reqResch')}
                </Button>
                <Button
                  onPress={_cancelRequestHandler}
                  color="red"
                  mode="contained"
                  uppercase={false}>
                  {I18n.t('cancelBook')}
                </Button>
              </View>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
                style={{marginTop: RFValue(5)}}
                mode="contained">
                {I18n.t('closeBtn')}
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.imgContainer}>
          {serviceOrdered.booking_details.photo ? (
            <Image
              source={{
                uri: PROVIDER_LOGO + serviceOrdered.booking_details.photo,
              }}
              style={styles.img}
            />
          ) : (
            <Image source={SMARTSEVA_LOGO} style={styles.img} />
          )}
        </View>

        {/*<View style={styles.contactsContainer}>*/}
        {/*  <Text style={styles.companyName}>{company_name}</Text>*/}
        {/*</View>*/}

        {/*{(status === 'ACCEPTED' || status === 'COMPLETED') &&*/}
        {/*  payment_status === 'SUCCESS' && (*/}
        {/*    <View style={styles.card}>*/}
        {/*      <Text style={[styles.bold, {fontSize: RFValue(14)}]}>*/}
        {/*        {I18n.t('contDetails')}*/}
        {/*      </Text>*/}
        {/*      <Divider style={styles.marginVertical} />*/}
        {/*      <Text style={{marginBottom: RFValue(5)}}>*/}
        {/*        {provider_email.toLowerCase()}*/}
        {/*      </Text>*/}
        {/*      <Text>{`${provider_phonecode}-${provider_mobile}`}</Text>*/}
        {/*    </View>*/}
        {/*  )}*/}

        <View style={[styles.card, {marginVertical: RFValue(10)}]}>
          <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
            {I18n.t('serviceDetails')}
          </Text>
          <Divider style={styles.marginVertical} />
          <TextRow heading={I18n.t('bookId')} text={booking_id} />
          <TextRow heading={I18n.t('dateAndTime')} text={booking_date_time} />
          <TextRow
            heading={'Service Name'}
            text={serviceOrdered.booking_details.service_name}
          />
          <TextRow
            heading={'Amount'}
            text={`₹ ${serviceOrdered.booking_details.final_service_price}`}
          />
          {!serviceOrdered.booking_details.booking_comment ? null : (
            <TextRow
              heading={I18n.t('inst')}
              text={serviceOrdered.booking_details.booking_comment}
            />
          )}
          {review_status=='REJECTED' && (
            <TextRow heading={I18n.t('instBy')} text={reject_reason} />
          )}
          <TextRow
            heading={I18n.t('bookStatus')}
            text={ review_status=='REJECTED'?'REJECTED': status}
            color={
              review_status=='REJECTED'?'red' :
              status === 'ACCEPTED' || status === 'COMPLETED'
                ? 'green'
                : status === 'REFUND'
                ? 'orange'
                : status === 'PENDING'
                ? 'grey'
                : status === 'RESCHEDULE'
                ? 'skyblue'
                : 'red'
            }
          />
          <TextRow
            heading={'Payment Type'}
            text={serviceOrdered.booking_details.payment_type}
            color={
              serviceOrdered.booking_details.payment_type === 'ONLINE'
                ? 'green'
                : 'skyblue'
            }
          />
          <TextRow
            heading={I18n.t('paymentStatus')}
            text={payment_status}
            color={
              payment_status === 'SUCCESS'
                ? 'green'
                : payment_status === 'REFUND'
                ? 'orange'
                : payment_status === 'PENDING'
                ? 'grey'
                : 'red'
            }
          />
          {status === 'RESCHEDULE' && (
            <TextRow
              heading="Rejected Reason"
              text={reject_reason}
              color="red"
            />
          )}
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
                  `+ ₹${serviceOrdered.booking_details.vat_amount}`,
                ]}
                textStyle={styles.text}
              />
              <Row
                data={
                  serviceOrdered.booking_details.additional_price > 0
                    ? [
                        serviceOrdered.booking_details.job_completed_comment,
                        `+ ₹${serviceOrdered.booking_details.additional_price}`,
                      ]
                    : null
                }
                textStyle={styles.text}
              />
              <Row
                data={[
                  'Total Amount',
                  `₹${serviceOrdered.booking_details.final_service_price}`,
                ]}
                style={[styles.head]}
                textStyle={[styles.text]}
              />
            </Table>
          </View>
        </View>
        {status === 'COMPLETED' && payment_status === 'SUCCESS' && (
          <Button
            mode={'contained'}
            style={styles.invoiceStyle}
            onPress={() => navigation.navigate('invoice')}>
            {I18n.t('invoiceBtn')}
          </Button>
        )}
        {/*Job Completed Description*/}
        <JobDescription
          status={status}
          payment_status={payment_status}
          bookingId={booking_id}
          navigation={navigation}
          confirmStatus={serviceOrdered.booking_details.confirm_status}
          confirmUserStatus={serviceOrdered.booking_details.confirm_reason}
          confirmUserImages={serviceOrdered.serviceConfirmation}
        />
        {/* Complaint details */}
        {status === 'COMPLETED' && serviceOrdered.complaints.cr_comment ? (
          <View style={[styles.card, {marginVertical: RFValue(10)}]}>
            <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
              {I18n.t('yourComplaint')}
            </Text>
            <Divider style={styles.marginVertical} />
            <TextRow
              heading={I18n.t('subj')}
              text={serviceOrdered.complaints.cr_subject}
            />
            <TextRow
              heading={I18n.t('comment')}
              text={serviceOrdered.complaints.cr_comment}
            />
            {serviceOrdered.complaints.feedback && (
              <TextRow
                heading={I18n.t('feedback')}
                text={serviceOrdered.complaints.feedback}
              />
            )}
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginHorizontal: RFValue(8),
          }}>
          {!status === 'REJECTED' ||
          !status === 'CANCELLED' ||
          !status === 'COMPLETED' ? (
            <Button
              icon="cancel"
              mode="contained"
              color="red"
              style={styles.button}
              disabled={
                status === 'REJECTED' ||
                status === 'CANCELLED' ||
                status === 'COMPLETED' ||
                loading
              }
              loading={loading}
              onPress={_cancelRequestHandler}>
              {I18n.t('cancelBtn')}
            </Button>
          ) : null}

          <Button
            icon="comment-check-outline"
            mode="contained"
            style={styles.button}
            disabled={
              status === 'PENDING' ||
              status === 'REJECTED' ||
              status === 'ACCEPTED' ||
              status === 'CANCELLED' ||
              status === 'RESCHEDULE' ||
              review_status === true
            }
            onPress={() =>
              navigation.navigate('PostReview', {
                provider: provider,
                booking_id,
              })
            }>
            {I18n.t('postRevBtn')}
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          {serviceOrdered.booking_details.payment_type === 'COD' &&
          serviceOrdered.booking_details.status === 'ACCEPTED' ? (
            <Button
              mode="contained"
              onPress={_onlinePaymentHandler}
              style={[
                styles.button,
                {marginVertical: 0, backgroundColor: 'green'},
              ]}
              loading={paymentLoader}
              disabled={paymentLoader}
              labelStyle={{color: Colors.white}}>
              Pay Now
            </Button>
          ) : null}
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
    margin: RFValue(4),
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    marginHorizontal: RFValue(8),
    marginBottom: RFValue(20),
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
});

export default RequestDetailScreen;
