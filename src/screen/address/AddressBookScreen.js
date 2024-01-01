import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Alert, Text, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, FAB, Switch} from 'react-native-paper';

import * as addressActions from '../../store/actions/address';
import {Loader} from '../../components/common/Loader';
import {TextRow} from '../../components/TextRow';
import Colors from '../../constants/Colors';
import I18n from '../../languages/I18n';

const AddressItem = ({item, index, onPress, onSetActive}) => {
  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  const _deleteAddress = async addressId => {
    setDeleteLoading(true);
    setError(null);
    try {
      await dispatch(addressActions.deleteAddress(addressId));
    } catch (e) {
      setError(e.message);
      setDeleteLoading(false);
    }
  };

  return (
    <Pressable
      style={[styles.addressCard, {marginTop: index === 0 ? RFValue(12) : 0}]}>
      <TextRow heading={I18n.t('name')} desc={item.name} />
      <TextRow heading={I18n.t('address')} desc={item.address} />
      <TextRow heading={I18n.t('countrySimple')} desc={item.country} />
      {/* <TextRow heading={'State'} desc={item.state} /> */}
      <TextRow heading={I18n.t('citySimple')} desc={item.city} />
      <TextRow
        heading={I18n.t('phone')}
        desc={`${item.phoneCode} ${item.phoneNumber}`}
      />
      <View style={styles.row}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Switch
            color={Colors.primary}
            value={item.isDefault}
            disabled={item.isDefault}
            onValueChange={() => onSetActive(item.id)}
          />
          <Text
            style={{
              color: item.isDefault ? 'green' : 'red',
              fontWeight: 'bold',
              marginLeft: RFValue(5),
            }}>
            {item.isDefault ? I18n.t('active') : I18n.t('inactive')}
          </Text>
        </View>
        <Button
          mode={'contained'}
          loading={deleteLoading}
          disabled={deleteLoading}
          onPress={() => _deleteAddress(item.id)}
          color={'red'}>
          Delete
        </Button>
      </View>
    </Pressable>
  );
};

const AddressBookScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addresses} = useSelector(state => state.address);

  const dispatch = useDispatch();

  const _getAddresses = async () => {
    try {
      setError(null);
      setLoading(true);

      await dispatch(addressActions.setAddresses());
    } catch (e) {
      // setError(e.message);
      setError('Please add a address..');
    }

    setLoading(false);
  };

  useEffect(() => {
    _getAddresses().then(() => null);
  }, []);

  const _updateDefaultAddress = async addressId => {
    try {
      setError(null);
      await dispatch(addressActions.setDefaultAddress(addressId));
    } catch (e) {
      setError(e.message);
    }
  };

  const _renderItem = ({item, index}) => (
    <AddressItem
      item={item}
      index={index}
      onSetActive={_updateDefaultAddress}
      onPress={() =>
        navigation.navigate('EditAddress', {
          addressId: item.id,
        })
      }
    />
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <FAB
        style={styles.fab}
        icon="plus"
        // onPress={() => navigation.navigate('NewAddress')}
        onPress={() => navigation.navigate('changeLocation')}
        color={Colors.white}
      />
      {addresses.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Address</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={_renderItem}
        />
      )}
    </View>
  );
};

export const screenOptions = () => ({
  headerTitle: I18n.t('addressBook'),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  addressCard: {
    borderRadius: RFValue(8),
    marginBottom: RFValue(12),
    backgroundColor: 'white',
    marginHorizontal: RFValue(12),
    padding: RFValue(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  rowHeading: {
    flex: 0.5,
    fontWeight: 'bold',
  },
});

export default AddressBookScreen;
