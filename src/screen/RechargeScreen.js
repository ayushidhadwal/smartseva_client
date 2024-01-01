import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Divider,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../src/constants/Colors';
import * as userActions from '../store/actions/user';

const RechargeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amt, setAmt] = useState('');

  const onSubmitHandler = async () => {
    if (Number(amt) < 100) {
      setError('Minimum recharge amount is 100');
      return;
    }

    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(userActions.Recharge(amt));
      navigation.navigate('OnlinePayment', {amt});
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <Image
        source={require('../../assets/mywallet.png')}
        style={{
          alignSelf: 'center',
          width: RFValue(400),
          height: RFValue(250),
          resizeMode: 'contain',
        }}
      />
      <Text style={styles.amtText}>ADD AMOUNT</Text>
      <TextInput
        mode="flat"
        label={'Amount (in Rs.)'}
        style={styles.input}
        value={amt}
        onChangeText={text => setAmt(text)}
        keyboardType={'number-pad'}
        dense
      />
      <Text style={{color: 'red', fontStyle: 'italic'}}>
        ** Note: minimum amount is Rs. 100
      </Text>
      <Button
        mode={'contained'}
        labelStyle={{color: 'white'}}
        uppercase={false}
        loading={btnLoading}
        disabled={btnLoading}
        onPress={onSubmitHandler}
        style={styles.btnStyles}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(20),
  },
  btnStyles: {
    marginVertical: RFValue(40),
    width: '45%',
    borderRadius: RFValue(50),
    alignSelf: 'center',
  },
  amtText: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    marginBottom: RFValue(30),
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default RechargeScreen;
