import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Badge, Card, Searchbar } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../languages/I18n';

const ServiceReqScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { bookingList } = useSelector(state => state.request);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredList([...bookingList]);
  }, [bookingList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.get_booking());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const _onSearchHandler = searchText => {
    setFilteredList(
      bookingList.filter(
        item =>
          item.service_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.booking_date_time
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.service_status
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.payment_status.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const _renderItem = ({ item, index }) => {

    console.log(item)

    return (
      <Card
        style={[styles.cardContainer, index === 0 && { marginTop: RFValue(10) }]}
        onPress={() =>
          navigation.navigate('RequestDetails', { providerDetails: item })
        }>
        <View style={styles.group}>
          <View style={styles.rowStyle}>
            <Text style={styles.bold}>{I18n.t('bookId')}: </Text>
            <Text style={styles.time1}>{item.booking_id}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.bold}>{I18n.t('bookTime')}: </Text>
            <Text style={styles.time}>{item.booking_date_time}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.bold}>{I18n.t('amt')}: </Text>
            <Text style={styles.time}>₹ {item.total_price}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.bold}>{I18n.t('serviceStatus')}: </Text>

            <Badge
              style={[
                styles.badge,
                {

                  backgroundColor:
                    item.review_status === 'REJECTED' ? 'red'
                      :
                      item.service_status === 'ACCEPTED' ||
                        item.service_status === 'COMPLETED'
                        ? 'green'
                        : item.service_status === 'REFUND'
                          ? 'orange'
                          : item.service_status === 'PENDING'
                            ? 'grey'
                            : item.service_status === 'RESCHEDULE'
                              ? 'skyblue'
                              : 'red',
                },
              ]}>
              <Text
                style={[
                  styles.time,
                  {
                    color: 'white',
                    fontSize: RFValue(10),
                  },
                ]}>
                {item.review_status == 'REJECTED' ?
                  item.review_status : item.service_status
                }
              </Text>
            </Badge>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.bold}>{I18n.t('paymentStatus')}: </Text>

            <Badge
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.payment_status === 'SUCCESS'
                      ? 'green'
                      : item.payment_status === 'REFUND'
                        ? 'orange'
                        : item.payment_status === 'PENDING'
                          ? 'grey'
                          : 'red',
                },
              ]}>
              <Text
                style={[
                  styles.time,
                  {
                    color: 'white',
                    fontSize: RFValue(10),
                  },
                ]}>
                {item.payment_status}
              </Text>
            </Badge>
          </View>
        </View>
      </Card>
    );
  }


  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        { text: 'OK', onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: RFValue(10),
    marginVertical: RFValue(40),
    marginHorizontal: RFValue(30),
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <View style={styles.container}>
        <View style={styles.containerStyle}>
          <Text style={styles.heading}>{I18n.t('serviceScreenTitle')}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Searchbar
            placeholder={I18n.t('search')}
            onChangeText={_onSearchHandler}
            value={search}
            style={styles.textInputStyle}
          />
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.indicator}
          />
        ) : filteredList.length === 0 ? (
          <Text style={styles.activity}>{I18n.t('noBook')}</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredList}
            keyExtractor={item => item.booking_id.toString()}
            renderItem={_renderItem}
          />
        )}
      </View>
    </SafeAreaView>
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
    paddingHorizontal: RFValue(5),
  },
  textInputStyle: {
    width: '100%',
  },
  iconStyle: {
    paddingHorizontal: RFValue(7),
    paddingVertical: RFValue(10),
  },
});

export default ServiceReqScreen;
