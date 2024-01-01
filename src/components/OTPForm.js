import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Text, I18nManager} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Colors from '../constants/Colors';

import * as authActions from '../store/actions/auth';

const OTPForm = props => {
  const {email, otp} = useSelector(state => state.auth);

  const [userOTP, setUserOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const otpsendAgain = useCallback(async () => {
    setOTPLoading(true);
    setError(null);
    try {
      await dispatch(authActions.forgotPassword({email}));
      // props.navigation.navigate("OTP")
    } catch (e) {
      setError(e.message);
      setOTPLoading(false);
    }
    setOTPLoading(false);
  }, [{email}]);

  const onNexthandler = useCallback(async () => {
    if (parseInt(otp) !== parseInt(userOTP)) {
      alert('Wrong OTP');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.verifyOtp({email, userOTP}));
      props.navigation.navigate('ResetPass');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [{email, userOTP}]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);
  return (
    <View style={styles.screen}>
      <View
        style={{
          marginTop: RFValue(50),
          alignItems: 'center',
        }}>
        <Text style={styles.heading}>Enter Verification Code</Text>
        <Text style={styles.heading2}>
          We have sent you a 6-digit Verification code on
        </Text>
        <Text style={styles.heading3}>{email}</Text>
      </View>
      <View style={styles.OTPcontainer}>
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Enter OTP"
          style={styles.input}
          value={userOTP}
          onChangeText={text => setUserOTP(text)}
          maxLength={6}
          keyboardType="number-pad"
        />
        <Text
          style={{
            marginTop: RFValue(10),
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Didn't receive OTP?{' '}
          <Text onPress={otpsendAgain} style={{color: Colors.primary}}>
            Send Again
          </Text>
        </Text>
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{paddingVertical: RFValue(10)}}
        onPress={onNexthandler}
        disabled={loading}
        loading={loading}>
        Verify
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(50),
  },
  heading: {
    fontSize: RFValue(19),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: RFValue(25),
  },
  heading2: {
    fontSize: RFValue(14),
    color: Colors.grey,
    marginVertical: RFValue(8),
    textAlign: 'center',
  },
  heading3: {
    fontSize: RFValue(14),
    color: Colors.black,
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginTop: RFValue(30),
  },
  OTPcontainer: {
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: RFValue(25),
  },
  roundedTextInput: {
    borderWidth: RFValue(4),
  },
  timer: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: RFValue(15),
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default OTPForm;
