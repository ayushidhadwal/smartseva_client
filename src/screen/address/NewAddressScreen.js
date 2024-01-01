import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View, Alert, Platform, I18nManager} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useDispatch, useSelector} from 'react-redux';
import * as addressActions from '../../store/actions/address';
import {MyHeaderButton} from '../../components/common/MyHeaderButton';
import I18n from '../../languages/I18n';
import * as authActions from '../../store/actions/auth';
import {SearchableDropdown} from '../../components/SearchableDropdown';

const NewAddressScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [flat, setFlat] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [name, setName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: '',
    long: '',
  });

  const dispatch = useDispatch();
  const {cities, states} = useSelector(state => state.auth);

  const latitude = route.params.lat;
  const longitude = route.params.long;
  const address2 = route.params.address2;
  const state2 = route.params.state2;
  const city2 = route.params.city2;
  const pincode2 = route.params.pincode2;

  useEffect(() => {
    setAddress(address2);
    setState(state2);
    setCity(city2);
    setPincode(pincode2);
    setLocation({
      lat: latitude,
      long: longitude,
    });
  }, [navigation, latitude, longitude, address2, state2, city2, pincode2]);

  const setData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authActions.setStates());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setData);

    return () => unsubscribe;
  }, [navigation, setData]);

  const setCities = useCallback(async () => {
    if (state) {
      setError(null);
      try {
        await dispatch(authActions.setCities(state));
      } catch (e) {
        setError(e.message);
      }
    }
  }, [dispatch, state]);

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

  const addAddressHandler = useCallback(async () => {
    try {
      setSubmitLoading(true);
      setError(null);

      await dispatch(
        addressActions.setNewAddress(
          address,
          state,
          city,
          name,
          phoneCode,
          phoneNumber,
          location.lat,
          location.long,
          flat,
          area,
          pincode,
        ),
      );
      setSubmitLoading(false);
      alert('Added Successfully!');
      navigation.navigate('AddressBook');
    } catch (e) {
      setSubmitLoading(false);
      setError(e.message);
    }
  }, [
    dispatch,
    address,
    state,
    city,
    name,
    phoneCode,
    phoneNumber,
    location.lat,
    location.long,
    navigation,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
          <Item
            disabled={submitLoading}
            title="save"
            iconName={'checkbox-sharp'}
            onPress={addAddressHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, addAddressHandler, submitLoading]);

  const onSelectState = value => {
    setState(value);
    setCity('');
  };

  const onSelectCity = value => {
    setCity(value);
  };

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
            onChangeText={value => setAddress(value)}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={'Flat No/House No.'}
            style={styles.input}
            value={flat}
            onChangeText={value => setFlat(value)}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={'Area'}
            style={styles.input}
            value={area}
            onChangeText={value => setArea(value)}
          />
          <SearchableDropdown
            label={'Select State'}
            data={states.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={state}
            onSelectValue={onSelectState}
          />
          <SearchableDropdown
            label={'Select City'}
            data={cities.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={city}
            onSelectValue={onSelectCity}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={'Pincode'}
            style={styles.input}
            value={pincode}
            onChangeText={value => setPincode(value)}
            keyboardType={'numeric'}
          />
          {/*<MyPicker*/}
          {/*  value={state}*/}
          {/*  placeholder={'State'}*/}
          {/*  onValueChange={value => setState(value)}*/}
          {/*  items={states.map(c => ({label: c.name, value: c.id}))}*/}
          {/*/>*/}
          {/*<MyPicker*/}
          {/*  value={city}*/}
          {/*  disabled={!state}*/}
          {/*  placeholder={I18n.t('city')}*/}
          {/*  onValueChange={value => setCity(value)}*/}
          {/*  items={cities.map(c => ({label: c.name, value: c.id}))}*/}
          {/*/>*/}

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
            onChangeText={setPhoneNumber}
            keyboardType="number-pad"
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            editable={false}
            label={'Latitude'}
            style={styles.input}
            value={`${location.lat}`}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            editable={false}
            label={'Longitude'}
            style={styles.input}
            value={`${location.long}`}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const screenOptions = () => ({
  headerTitle: I18n.t('newAddress'),
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

export default NewAddressScreen;
