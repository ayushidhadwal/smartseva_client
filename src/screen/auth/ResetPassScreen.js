import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, StatusBar, View, Image, I18nManager} from 'react-native';
import {TextInput, Title, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const ResetPassScreen = props => {
  const {token} = useSelector(state => state.auth);

  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onSubmithandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        authActions.set_new_password({token, password, password_confirmation}),
      );
      props.navigation.navigate('Login');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [{token, password, password_confirmation}]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);
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
        <View style={styles.imgContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.img}
          />
        </View>
        <Title style={styles.title}>Reset Password</Title>
        <View style={styles.form}>
          <TextInput
            left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label="New Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TextInput
            left={<TextInput.Icon name="lock-reset" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label="Confirm New Password"
            style={styles.input}
            secureTextEntry
            value={password_confirmation}
            onChangeText={text => setPassword_confirmation(text)}
          />
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={{paddingVertical: RFValue(2)}}
            contentStyle={{height: 50}}
            //onPress={() => props.navigation.navigate("ResetPass")}
            onPress={onSubmithandler}
            disabled={loading}
            loading={loading}>
            submit
          </Button>
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
  imgContainer: {
    width: wp('100%'),
    height: hp('25%'),
    alignItems: 'center',
    //paddingTop: RFValue(15),
    // backgroundColor: Colors.primary,
    borderBottomLeftRadius: RFValue(30),
    borderBottomRightRadius: RFValue(30),
  },
  img: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',

    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingVertical: RFValue(30),
  },
  btn: {
    height: 50,
    marginTop: RFValue(40),
  },
  form: {
    padding: RFValue(15),
  },
  input: {backgroundColor: Colors.white},
});

export default ResetPassScreen;
