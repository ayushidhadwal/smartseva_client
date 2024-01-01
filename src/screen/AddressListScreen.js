import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, RadioButton, Subheading} from 'react-native-paper';

import * as addressActions from '../store/actions/address';
import {Loader} from '../components/common/Loader';
import Colors from '../constants/Colors';
import I18n from '../languages/I18n';

const AddressListScreen = props => {
  const service = props.route.params.service;
  const cartTotal = props.route.params.cartTotal;
  const convenienceFee = props.route.params.convenienceFee;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const {addresses} = useSelector(state => state.address);

  const dispatch = useDispatch();

  const _getAddresses = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      await dispatch(addressActions.setAddresses());
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    _getAddresses();
  }, [_getAddresses]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const onPressHandler = addressId => {
    setAddress(addressId);
  };

  if (loading) {
    return <Loader />;
  }

  if (addresses.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Pressable
          onPress={() => props.navigation.navigate('AddressBook')}
          style={[
            styles.radioButtonContainer,
            {
              alignItems: 'center',
              marginBottom: RFValue(12),
              borderWidth: 2,
              borderColor: '#dedede',
              borderStyle: 'dashed',
            },
          ]}>
          <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>
            {I18n.t('addAddress')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View>
          <Subheading style={[styles.summaryHeading, {marginTop: RFValue(12)}]}>
            {I18n.t('selectAddress')}
          </Subheading>
          <RadioButton.Group
            onValueChange={newValue => setAddress(newValue)}
            value={address}>
            {addresses.map(item => (
              <Pressable
                onPress={() => onPressHandler(item.id)}
                key={item.id}
                style={styles.radioButtonContainer}>
                <RadioButton.Android value={item.id} color={Colors.primary} />
                <Text style={styles.radioHeading}>
                  {item.name}, {item.address}, {item.city}, {item.country}
                </Text>
              </Pressable>
            ))}
          </RadioButton.Group>
        </View>
      </ScrollView>
      <View>
        <Pressable
          onPress={() => props.navigation.navigate('AddressBook')}
          style={{
            alignItems: 'center',
            marginTop: RFValue(10),
            borderWidth: 2,
            borderColor: '#dedede',
            borderStyle: 'dashed',
            marginHorizontal: 12,
          }}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', padding: 10}}>
            {I18n.t('addAddress')}
          </Text>
        </Pressable>
        <Button
          mode="contained"
          style={styles.btnStyles}
          onPress={() =>
            props.navigation.navigate('SlotBooking', {
              service: service,
              address_id: address,
              cartTotal: cartTotal,
              convenienceFee: convenienceFee,
            })
          }
          disabled={address === ''}>
          {I18n.t('nextBtn')}
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 0.9,
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
  selectAddress: {
    borderWidth: RFValue(5),
    borderColor: Colors.primary,
  },
  btnStyles: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: RFValue(12),
    marginTop: RFValue(12),
    padding: RFValue(10),
  },
  radioHeading: {
    fontWeight: 'bold',
    width: '80%',
  },
  summaryHeading: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddressListScreen;
