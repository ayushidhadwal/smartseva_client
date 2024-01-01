import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Card, Divider, Searchbar, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../languages/I18n';

const ServiceList = ({navigation}) => {
  const dispatch = useDispatch();
  const {completedRequest} = useSelector(state => state.request);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredList([...completedRequest]);
  }, [completedRequest]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.getCompletedRequest());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const _renderItem = ({item, index}) => (
    <Card
      style={[styles.cardContainer, index === 0 && {marginTop: RFValue(10)}]}
      onPress={() =>
        navigation.navigate('Complaintform', {
          booking_id: item.booking_id,
          partner_id: item.provider,
        })
      }>
      <View style={styles.rowStyle}>
        <Title numberOfLines={2} style={styles.heading}>
          {item.company_name}
        </Title>
        <Text style={styles.text1}>{item.service_status}</Text>
      </View>
      <Divider style={{marginVertical: RFValue(10)}} />
      <Text style={styles.text}>
        <Text style={styles.bold}>{I18n.t('paymentStatus')}: </Text>
        {item.payment_status}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>{I18n.t('bookTime')}: </Text>
        {item.booking_date_time}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>{I18n.t('bookId')}: </Text>
        {item.booking_id}
      </Text>
    </Card>
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _onSearchHandler = searchText => {
    setFilteredList(
      completedRequest.filter(
        item =>
          item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.service_status
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          // item.sub_service_name
          //   .toLowerCase()
          //   .includes(searchText.toLowerCase()) ||
          // item.service_price.toLowerCase().includes(searchText.toLowerCase()) ||
          item.booking_date_time
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.booking_id.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Searchbar
        placeholder={I18n.t('search')}
        onChangeText={_onSearchHandler}
        value={search}
        style={styles.textInputStyle}
      />
      {filteredList.length === 0 ? (
        <Text style={styles.activity}>No Completed Jobs</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredList}
          keyExtractor={item => item.booking_id}
          renderItem={_renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardContainer: {
    padding: RFValue(10),
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
    alignItems: 'flex-start',
  },
  text: {
    fontSize: RFValue(12),
    marginBottom: RFValue(2),
  },
  text1: {
    backgroundColor: 'green',
    padding: RFValue(5),
    fontSize: RFValue(13),
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: RFValue(5),
    width: '30%',
  },
  heading: {
    marginBottom: RFValue(3),
    width: '70%',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ServiceList;
