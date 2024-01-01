import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import I18n from '../../languages/I18n';
import {FAB} from 'react-native-paper';

const WalletScreen = ({navigation}) => {
  const {Profile} = useSelector(state => state.user);

  return (
    <View style={styles.screen}>
      {/*<Pressable*/}
      {/*  style={styles.categorySection3}*/}
      {/*  onPress={() => navigation.navigate('Reward')}>*/}
      {/*  <Image*/}
      {/*    source={require('../../../assets/gift.png')}*/}
      {/*    style={styles.img}*/}
      {/*  />*/}
      {/*  <View>*/}
      {/*    <Text style={styles.ref}>{I18n.t('referEarn')}</Text>*/}
      {/*    <Text>{I18n.t('referEarnMsg')}</Text>*/}
      {/*  </View>*/}
      {/*  <AntDesign*/}
      {/*    name="right"*/}
      {/*    size={24}*/}
      {/*    color="black"*/}
      {/*    style={styles.rightIcon}*/}
      {/*  />*/}
      {/*</Pressable>*/}
      <View style={styles.categorySection4}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../../assets/WalletCash.png')}
            style={styles.img2}
          />

          <Text style={styles.cash1}>SMARTSEVA Cash</Text>
        </View>
        <Text style={styles.cash}>
          {I18n.t('aed')} {Profile.wallet}
        </Text>
      </View>

      <Pressable
        style={styles.categorySection3}
        onPress={() => navigation.navigate('walletActivity')}>
        <Text style={styles.cash1}>{I18n.t('walletActivity')}</Text>
        <AntDesign
          name="right"
          size={24}
          color="black"
          style={styles.rightIcon}
        />
      </Pressable>
      {/*<FAB*/}
      {/*  style={styles.fab}*/}
      {/*  small*/}
      {/*  icon="plus"*/}
      {/*  label={'Recharge'}*/}
      {/*  onPress={() => navigation.navigate('Recharge')}*/}
      {/*/>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  categorySection3: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.white,
    marginTop: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySection4: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(25),
    backgroundColor: Colors.white,
    marginTop: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: RFValue(35),
    height: RFValue(35),
  },
  ref: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  rightIcon: {
    alignSelf: 'flex-end',
    paddingBottom: RFValue(8),
  },
  img2: {
    width: RFValue(35),
    height: RFValue(35),
  },
  cash1: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    paddingLeft: RFValue(30),
  },
  cash: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(15),
  },
  question: {
    fontSize: RFValue(15),
  },
  wallet: {
    padding: RFValue(15),
    fontSize: RFValue(15),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
});

export const screenOptions = () => ({
  headerTitle: I18n.t('myWallet'),
});

export default WalletScreen;
