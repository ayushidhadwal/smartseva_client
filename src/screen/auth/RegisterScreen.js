import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  I18nManager,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import I18n from '../../languages/I18n';

const RegisterScreen = ({navigation}) => {
  const [referral, setReferral] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState({
    id: '',
    name: '',
  });
  const [city, setCity] = useState({
    id: '',
    name: '',
  });
  const [phoneCode, setPhoneCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {countries, cities} = useSelector(state => state.auth);

  // const setCountries = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     await dispatch(authActions.setCountries());
  //   } catch (e) {
  //     setError(e.message);
  //   }
  //   setLoading(false);
  // }, [dispatch]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', setCountries);
  //   return () => unsubscribe;
  // }, [navigation, setCountries]);

  // const setCities = useCallback(async () => {
  //   if (country.id) {
  //     setCityLoading(true);
  //     setError(null);
  //     try {
  //       await dispatch(authActions.setCities(country.id));
  //     } catch (e) {
  //       setError(e.message);
  //     }
  //     setCityLoading(false);
  //   }
  // }, [country.id, dispatch]);
  //
  // useEffect(() => {
  //   setCities();
  // }, [setCities]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  // const _selectCountryHandler = useCallback(item => {
  //   setPhoneCode(item.phonecode);
  //   setCountry({
  //     id: item.id,
  //     name: item.name,
  //   });
  //   setCity({
  //     id: '',
  //     name: '',
  //   });
  // }, []);
  //
  // const _selectCityHandler = useCallback(item => {
  //   setCity({
  //     name: item.name,
  //     id: item.id,
  //   });
  // }, []);

  const _onRegister = useCallback(async () => {
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(mobile)) {
      setError('Mobile Number must be Number');
      return;
    }
    setSubmitLoading(true);
    setError(null);
    try {
      await dispatch(
        authActions.register({
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          phoneCode: phoneCode,
          mobile: mobile,
          referral: referral,
        }),
      );
      setSubmitLoading(false);
      navigation.replace('VerifyEmail');
    } catch (e) {
      setError(e.message);
      setSubmitLoading(false);
    }
  }, [
    name,
    email,
    password,
    confirmPassword,
    phoneCode,
    mobile,
    country,
    city,
    navigation,
    referral,
  ]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{backgroundColor: Colors.white}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logoImg}
            />
          </View>
          <Title style={styles.register}>{I18n.t('reg')}</Title>
          <View style={styles.form}>
            <TextInput
              left={<TextInput.Icon name="account" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={'Name'}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              left={<TextInput.Icon name="email" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('email')}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.mobile}>
              <TextInput
                left={<TextInput.Icon name="phone" color={Colors.primary} />}
                mode={I18nManager.isRTL ? 'outlined' : 'flat'}
                style={{
                  backgroundColor: Colors.white,
                  width: '35%',
                  marginLeft: RFValue(10),
                }}
                placeholder={I18n.t('code')}
                editable={false}
                value={phoneCode}
              />
              <TextInput
                mode={I18nManager.isRTL ? 'outlined' : 'flat'}
                // maxLength={10}
                // minLength={10}
                label={I18n.t('mob')}
                style={styles.number}
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
              />
            </View>
            <TextInput
              left={
                <TextInput.Icon name="lock-outline" color={Colors.primary} />
              }
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('password')}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              left={<TextInput.Icon name="lock" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('confPass')}
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {/*<View style={styles.dropDownStyles}>*/}
            {/*  <Ionicons*/}
            {/*    name="earth"*/}
            {/*    size={24}*/}
            {/*    color={Colors.primary}*/}
            {/*    style={styles.earth}*/}
            {/*  />*/}
            {/*  <RNPicker*/}
            {/*    dataSource={countries}*/}
            {/*    pickerTitle="Select Country"*/}
            {/*    showPickerTitle={true}*/}
            {/*    pickerStyle={styles.pickerStyle}*/}
            {/*    itemSeparatorStyle={styles.itemSeparatorStyle}*/}
            {/*    pickerItemTextStyle={styles.listTextViewStyle}*/}
            {/*    selectedLabel={country.name}*/}
            {/*    placeHolderLabel={I18n.t('country')}*/}
            {/*    selectLabelTextStyle={styles.selectLabelTextStyle}*/}
            {/*    placeHolderTextStyle={styles.placeHolderTextStyle}*/}
            {/*    selectedValue={(index, item) => _selectCountryHandler(item)}*/}
            {/*    dropDownImageStyle={styles.dropDownImageStyle}*/}
            {/*  />*/}
            {/*</View>*/}

            {/*<View style={styles.dropDownStyles}>*/}
            {/*  <Ionicons*/}
            {/*    name="location"*/}
            {/*    size={24}*/}
            {/*    color={Colors.primary}*/}
            {/*    style={styles.earth}*/}
            {/*  />*/}
            {/*  {cityLoading ? (*/}
            {/*    <ActivityIndicator*/}
            {/*      color={Colors.primary}*/}
            {/*      size="small"*/}
            {/*      style={{height: RFValue(55), marginLeft: RFValue(110)}}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    <RNPicker*/}
            {/*      dataSource={cities}*/}
            {/*      pickerTitle="Select City"*/}
            {/*      showPickerTitle={true}*/}
            {/*      pickerStyle={styles.pickerStyle}*/}
            {/*      itemSeparatorStyle={styles.itemSeparatorStyle}*/}
            {/*      pickerItemTextStyle={styles.listTextViewStyle}*/}
            {/*      selectedLabel={city.name}*/}
            {/*      placeHolderLabel={I18n.t('city')}*/}
            {/*      selectLabelTextStyle={styles.selectLabelTextStyle}*/}
            {/*      placeHolderTextStyle={styles.placeHolderTextStyle}*/}
            {/*      selectedValue={(index, item) => _selectCityHandler(item)}*/}
            {/*      dropDownImageStyle={styles.dropDownImageStyle}*/}
            {/*      disablePicker={!country.id}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</View>*/}
            <TextInput
              left={<TextInput.Icon name="account" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('referralCode')}
              style={styles.input}
              value={referral}
              onChangeText={setReferral}
            />
            <View
              style={{
                backgroundColor: Colors.primary,
                alignItems: 'center',
                alignSelf: 'center',
                paddingVertical: RFValue(15),
                width: '20%',
                marginVertical: RFValue(30),
                borderRadius: RFValue(100),
              }}
              pointerEvents={loading ? 'none' : null}>
              <TouchableOpacity
                onPress={_onRegister}
                loading={submitLoading}
                disabled={submitLoading}>
                {submitLoading ? (
                  <ActivityIndicator size={'large'} color={Colors.white} />
                ) : (
                  <Ionicons
                    name="arrow-forward"
                    size={30}
                    color={Colors.white}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>Already have an account. Click Here For </Text>
              <Text
                style={styles.signUp}
                onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    backgroundColor: 'white',
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignSelf: 'center',
    // paddingTop: RFValue(15),
    // backgroundColor: Colors.primary,
    borderBottomLeftRadius: RFValue(30),
    borderBottomRightRadius: RFValue(30),
  },
  register: {
    textAlign: 'center',
    // textDecorationLine: "underline",
    fontSize: RFValue(30),
    textTransform: 'uppercase',
    paddingVertical: RFValue(15),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  mobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  form: {padding: RFValue(15)},
  ///
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: RFValue(10),
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: Colors.grey,
    padding: RFValue(10),
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
    fontSize: RFValue(14),
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: RFValue(10),
    flex: 0.9,
    marginLeft: RFValue(20),
    marginHorizontal: RFValue(10),
    textAlign: 'left',
  },
  pickerStyle: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    width: '90%',
    alignItems: 'center',
  },
  pickerStyleCode: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    width: '75%',
  },
  dropDownImageStyle: {
    width: RFValue(10),
    height: RFValue(10),
    alignSelf: 'center',
  },
  //
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    // borderBottomWidth: RFValue(1),
    // borderBottomColor: "#d3d3d3",
    marginLeft: RFValue(10),
    marginRight: RFValue(10),
    flex: 1,
  },
  mobileIcon: {
    alignSelf: 'center',
    marginLeft: RFValue(15),
  },
  number: {
    width: '55%',
    backgroundColor: Colors.white,
    marginRight: RFValue(10),
  },
  dropDownStyles: {
    flexDirection: 'row',
    marginHorizontal: RFValue(10),
    borderBottomWidth: RFValue(1),
    borderBottomColor: '#d3d3d3',
  },
  earth: {
    paddingTop: RFValue(20),
    marginLeft: RFValue(10),
  },
  //
  btn: {
    alignSelf: 'center',
    width: '40%',
    borderRadius: RFValue(50),
    marginVertical: RFValue(30),
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUp: {
    color: Colors.primary,
    paddingTop: RFValue(2),
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
