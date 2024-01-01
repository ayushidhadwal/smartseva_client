import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Card, Divider, Searchbar} from 'react-native-paper';
import dayjs from 'dayjs';

import * as userActions from '../store/actions/user';
import Colors from '../constants/Colors';
import I18n from '../languages/I18n';

const WalletTransaction = ({navigation}) => {
  const dispatch = useDispatch();
  const {TransactionList} = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredTransactionList, setFilteredTransactionList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredTransactionList([...TransactionList]);
  }, [TransactionList]);

  const setTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(userActions.get_wallet_transactions());
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setTransactions);
    return () => unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _renderItem = ({item, index}) => (
    <Card
      style={[styles.cardContainer, index === 0 && {marginTop: RFValue(10)}]}>
      <View style={styles.rowStyle}>
        <Text style={styles.amt}>
          {I18n.t('amt')}: {I18n.t('aed')} {item.wt_amount}
        </Text>
        <Text style={item.wt_type === 'CREDIT' ? styles.credit : styles.debit}>
          {item.wt_type}
        </Text>
      </View>
      <Divider style={{marginVertical: RFValue(5)}} />
      <Text style={styles.time}>
        <Text style={{fontWeight: 'bold'}}>{I18n.t('time')}:</Text>{' '}
        {dayjs(item.created_at).format('DD MMM YYYY , hh:mm A')}
      </Text>
      <Text style={styles.desc}>
        <Text style={{fontWeight: 'bold'}}>{I18n.t('desc')}:</Text>{' '}
        {item.wt_details}
      </Text>
    </Card>
  );

  const _onSearchHandler = searchText => {
    setFilteredTransactionList(
      TransactionList.filter(
        item =>
          item.wt_amount.toLowerCase().includes(searchText.toLowerCase()) ||
          item.wt_type.toLowerCase().includes(searchText.toLowerCase()) ||
          item.wt_details.toLowerCase().includes(searchText.toLowerCase()) ||
          item.created_at.toLowerCase().includes(searchText.toLowerCase()),
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
      {filteredTransactionList.length === 0 ? (
        <Text style={styles.activity}>{I18n.t('noAct')}</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredTransactionList}
          keyExtractor={item => item.id.toString()}
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
  },
  credit: {
    backgroundColor: 'green',
    padding: RFValue(5),
    fontSize: RFValue(12),
    fontWeight: 'bold',
    color: Colors.white,
    borderRadius: RFValue(10),
  },
  debit: {
    backgroundColor: Colors.darkYellow,
    padding: RFValue(5),
    fontSize: RFValue(12),
    fontWeight: 'bold',
    color: Colors.white,
    borderRadius: RFValue(10),
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
  amt: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    paddingTop: RFValue(5),
  },
  time: {
    fontSize: RFValue(12),
    marginBottom: RFValue(5),
  },
  desc: {
    fontSize: RFValue(12),
    textTransform: 'capitalize',
  },
});

export default WalletTransaction;
