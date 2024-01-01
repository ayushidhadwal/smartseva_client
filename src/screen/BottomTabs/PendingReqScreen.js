import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Badge, Card} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import I18n from '../../languages/I18n';
import Colors from '../../constants/Colors';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import * as requestAction from '../../store/actions/request';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components/common/Loader';

const PendingReqScreen = ({navigation}) => {
  const {pendingList} = useSelector(state => state.request);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.get_pending_req());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getData);
    return () => unsubscribe;
  }, [dispatch, getData, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _renderItem = ({item, index}) => (
    <Card
      style={[styles.cardContainer, index === 0 && {marginTop: RFValue(10)}]}
      onPress={() =>
        navigation.navigate('paymentDetailMethod', {bookingId: item.booking_id})
      }>
      <View style={styles.group}>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>{I18n.t('bookId')}: </Text>
          <Text style={styles.time1}>{item.booking_id}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>{I18n.t('bookTime')}: </Text>
          <Text style={styles.time}>
            {item.booking_date} {item.booking_time}
          </Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>{I18n.t('amt')}: </Text>
          <Text style={styles.time}>₹ {item.total_price}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>Payment Method</Text>
          <Badge style={styles.badge}>
            <Text
              style={[
                styles.time,
                {
                  color: 'white',
                  fontSize: RFValue(10),
                },
              ]}>
              {item.payment_type}
            </Text>
          </Badge>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={styles.activity}
      />
    );
  }

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.container}>
          <View style={styles.containerStyle}>
            <Text style={styles.heading}>My Pending Request</Text>
          </View>
          {pendingList.length === 0 ? (
            <Text style={styles.activity}>No Pending Request</Text>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pendingList}
              keyExtractor={item => item.booking_id.toString()}
              renderItem={_renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: RFValue(16),
    color: Colors.black,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: RFValue(5),
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: RFValue(3),
  },
  type: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: Colors.black,
  },
  time: {
    fontSize: RFValue(12),
    color: Colors.black,
  },
  time1: {
    fontSize: RFValue(12),
    color: Colors.black,
    fontWeight: 'bold',
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
  group: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
  },
  service_name: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    // marginBottom: RFValue(5),
    textAlign: 'center',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: RFValue(10),
    backgroundColor: Colors.primary,
  },
  textInputStyle: {
    width: '100%',
  },
  iconStyle: {
    paddingHorizontal: RFValue(7),
    paddingVertical: RFValue(10),
  },
});

export default PendingReqScreen;
