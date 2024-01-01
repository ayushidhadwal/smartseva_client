import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Text, I18nManager} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import I18n from '../languages/I18n';

const LoginForm = ({navigation}) => {
  const {local} = useSelector(state => state.lang);
  I18n.locale = local;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {register} = useSelector(state => state.auth);

  useEffect(() => {
    if (
      (!register.mobileVerified || !register.emailVerified) &&
      register.userId
    ) {
      navigation.navigate('VerifyEmail');
    }
  }, [register]);

  const loginHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.login({email, password}));
      setLoading(false);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [email, password]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  return (
      <View style={styles.screen}>
      <View style={styles.imgContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logoImg}
        />
      </View>
      <Title style={styles.title}>{I18n.t('title')}</Title>
      <View style={{paddingHorizontal: RFValue(15)}}>
        <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('email')}
          style={{backgroundColor: Colors.white}}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('password')}
          secureTextEntry
          style={{backgroundColor: Colors.white}}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          mode="contained"
          style={styles.btn}
          labelStyle={{paddingVertical: RFValue(2)}}
          contentStyle={{height: 50}}
          onPress={loginHandler}
          loading={loading}
          disabled={loading}>
          {I18n.t('btn')}
        </Button>
        <Text
          style={styles.forgot}
          onPress={() => navigation.navigate('Forgot')}>
          {I18n.t('forgot')}
        </Text>

        <Text style={styles.account}>{I18n.t('dont')}</Text>
        <Text
          style={styles.signUp}
          onPress={() => navigation.navigate('Register')}>
          {I18n.t('signUp')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('25%'),
    alignItems: 'center',
    borderBottomLeftRadius: RFValue(30),
    borderBottomRightRadius: RFValue(30),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(30),
    textTransform: 'uppercase',
    paddingVertical: RFValue(30),
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(60),
  },
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  forgot: {
    color: Colors.primary,
    paddingVertical: RFValue(10),
    fontWeight: 'bold',
    textAlign: 'right',
  },
  signUp: {
    color: Colors.primary,
    paddingTop: RFValue(2),
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  account: {
    color: Colors.primary,
    paddingTop: RFValue(70),
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default LoginForm;
