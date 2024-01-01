import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Colors from '../../constants/Colors';

const PaymentOption = () => {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../../../assets/Wallet.png')}
        style={styles.img}
      />
      <Text style={styles.heading}>No payment option available to de-link</Text>
    </View>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: RFValue(150),
    height: RFValue(180),
  },
  heading: {
    fontSize: RFValue(16),
    color: Colors.Grey,
    paddingVertical: RFValue(15),
  },
});
