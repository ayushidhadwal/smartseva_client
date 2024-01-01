import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Alert, Platform, I18nManager} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import {Loader} from '../../components/common/Loader';
import {useDispatch, useSelector} from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as addressActions from '../../store/actions/address';
import {MyHeaderButton} from '../../components/common/MyHeaderButton';
import I18n from '../../languages/I18n';

const MyPicker = props => (
  <View>
    <RNPickerSelect
      {...props}
      placeholder={{label: props.placeholder}}
      style={pickerSelectStyles}
    />
  </View>
);

const EditAddressScreen = ({route, navigation}) => {
  const {addressId} = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useDispatch();
  const {address: editAddress} = useSelector(state => state.address);
  const {countries, cities} = useSelector(state => state.auth);

  useEffect(() => {
    setAddress(editAddress.address);
    setCity(editAddress.city);
    setCountry(editAddress.country);
    setName(editAddress.name);
    setPhoneCode(editAddress.phoneCode);
    setPhoneNumber(editAddress.phoneNumber);
  }, [editAddress]);

  useEffect(() => {
    if (!country) {
      setPhoneCode('');
      setCity('');
    }
    const found = countries.find(c => parseInt(c.id) === parseInt(country));

    if (found) {
      setPhoneCode(found.phonecode);
    }
  }, [country, countries]);

  const setData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(addressActions.setSingleAddress(addressId));
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setData);

    return () => unsubscribe;
  }, [navigation]);

  const setCities = useCallback(async () => {
    if (country) {
      setError(null);
      try {
        await dispatch(authActions.setCities(country));
      } catch (e) {
        setError(e.message);
      }
    }
  }, [country]);

  useEffect(() => {
    setCities().then(() => null);
  }, [setCities]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _editAddressHandler = useCallback(async () => {
    try {
      setSubmitLoading(true);
      setError(null);
      await dispatch(
        addressActions.updateAddress(
          addressId,
          address,
          country,
          city,
          name,
          phoneCode,
          phoneNumber,
          editAddress.isDefault,
        ),
      );
      alert('Address Updated Successfully!');
    } catch (e) {
      setError(e.message);
    }

    setSubmitLoading(false);
  }, [
    addressId,
    address,
    country,
    city,
    name,
    phoneCode,
    phoneNumber,
    editAddress.isDefault,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
          <Item
            disabled={submitLoading}
            title="save"
            iconName={
              Platform.OS === 'ios'
                ? 'ios-checkmark-circle-outline'
                : 'md-checkmark-circle-outline'
            }
            onPress={_editAddressHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, _editAddressHandler]);

  const _deleteAddress = async () => {
    try {
      setSubmitLoading(true);
      setError(null);
      await dispatch(addressActions.deleteAddress(addressId));
      setDeleteLoading(false);
      alert('Success!');
      navigation.navigate('AddressBook');
    } catch (e) {
      setDeleteLoading(false);
      setError(e.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <View style={styles.form}>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('address')}
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <MyPicker
            value={country}
            placeholder="Select Country"
            onValueChange={value => setCountry(value)}
            items={countries.map(c => ({label: c.name, value: c.id}))}
          />
          <MyPicker
            value={city}
            disabled={!country}
            placeholder="Select City"
            onValueChange={value => setCity(value)}
            items={cities.map(c => ({label: c.name, value: c.id}))}
          />

          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('name')}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('mob')}
            style={styles.input}
            left={<TextInput.Affix text={phoneCode + ' '} />}
            value={phoneNumber}
            keyboardType="number-pad"
            onChangeText={setPhoneNumber}
          />

          <Button
            color="red"
            onPress={_deleteAddress}
            loading={deleteLoading}
            disabled={submitLoading || deleteLoading}
            style={{marginTop: RFValue(30)}}>
            {I18n.t('deleteAddressBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const screenOptions = () => ({
  headerTitle: I18n.t('editAddress'),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    margin: RFValue(12),
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: RFValue(12),
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  pickerLabel: {},
});

export default EditAddressScreen;
