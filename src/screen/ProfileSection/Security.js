import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Alert, I18nManager} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import I18n from '../../languages/I18n';

const Security = () => {
  const dispatch = useDispatch();
  const {user_id} = useSelector(state => state.auth);

  const [old_password, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onClickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        userActions.updatePassword(
          user_id,
          old_password,
          password,
          password_confirmation,
        ),
      );
      setPassword_confirmation('');
      setOldPassword('');
      setPassword('');
      setError(I18n.t('alertPassUpdMsg'));
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [user_id, old_password, password, password_confirmation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <>
          <View style={styles.imgContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logoImg}
            />
          </View>
          <Title style={styles.title}>{I18n.t('changePass')}</Title>
          <View style={styles.form}>
            <TextInput
              left={
                <TextInput.Icon name="lock-outline" color={Colors.primary} />
              }
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('oldPass')}
              secureTextEntry
              style={styles.input}
              value={old_password}
              onChangeText={setOldPassword}
            />
            <TextInput
              left={
                <TextInput.Icon name="lock-outline" color={Colors.primary} />
              }
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('newPass')}
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
              value={password_confirmation}
              onChangeText={setPassword_confirmation}
            />
            <Button
              mode="contained"
              style={styles.btn}
              labelStyle={{paddingVertical: RFValue(2)}}
              contentStyle={{height: 50}}
              onPress={onClickHandler}
              loading={loading}
              disabled={loading}>
              {I18n.t('updBtn')}
            </Button>
          </View>
        </>
      </KeyboardAwareScrollView>
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
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignItems: 'center',
    // paddingTop: RFValue(15),
    // backgroundColor: Colors.primary,
    // paddingBottom: RFValue(20),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(10),
  },
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  form: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(15),
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default Security;
