import React from 'react';
import {useSelector} from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import {Divider, Headline} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import I18n from '../../languages/I18n';
import {androidPackageName} from '../../constants/common';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const RewardScreen = () => {
  const {Profile} = useSelector(state => state.user);

  let sharingUrl = `https://play.google.com/store/apps/details?id=${androidPackageName}`;
  let SharingMessage =
    sharingUrl + '. Here this is referral code: ' + Profile.referral_code;

  const onShare = async () => {
    try {
      await Share.share({
        message: 'SMARTSEVA\n' + SharingMessage,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={{backgroundColor: Colors.white}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.containerStyle}>
          <Text style={styles.heading}>{I18n.t('referToWin')}</Text>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerRow1}>
            <View style={{flex: 1}}>
              <Headline style={{fontWeight: 'bold'}}>
                {I18n.t('referToWin')}
              </Headline>
              <Text>
                {`You get up to ₹ ${Profile.referPoints} for each referral.`}
              </Text>
            </View>
            <Image
              source={require('../../../assets/gift.png')}
              style={styles.gift}
            />
          </View>
          <Divider />
          <Text style={styles.ref}>{I18n.t('referVia')}</Text>
          <View style={styles.iconRow}>
            <FontAwesome
              name="whatsapp"
              size={30}
              color="#4acc64"
              style={styles.iconStyle}
              onPress={onShare}
            />
            <Pressable style={[styles.iconStyle]} onPress={onShare}>
              <Image
                source={require('../../../assets/instagram.png')}
                style={{width: 30, height: 30, alignSelf: 'center'}}
              />
            </Pressable>
            <Fontisto
              name="link"
              size={30}
              color={Colors.primary}
              style={styles.iconStyle}
              onPress={onShare}
            />
          </View>
          <View style={styles.iconName}>
            <Text>{I18n.t('whatsapp')}</Text>
            <Text>{I18n.t('messanger')}</Text>
            <Text>{I18n.t('copyLink')}</Text>
          </View>
        </View>
        <View style={styles.containerStyle1}>
          <Headline style={styles.heading2}>{I18n.t('howItWork')}</Headline>
          <View style={styles.row1}>
            <Image
              source={require('../../../assets/reward-1.png')}
              style={styles.img1}
            />
            <Text style={styles.text1}>
              Invite your friends to SMARTSEVA to get ₹ {Profile.referPoints} in
              your wallet (non registered friends).
              {/*{I18n.t("howPt1")}*/}
            </Text>
          </View>
          <View style={styles.row1}>
            <Image
              source={require('../../../assets/reward-2.png')}
              style={styles.img2}
            />
            <Text style={styles.text2}>
              {`You will receive a reward of ₹ ${Profile.referPoints} on `}
              <Text style={{color: Colors.primary}}>{I18n.t('signUp')}</Text>.
            </Text>
          </View>
          {/*<View style={styles.row1}>*/}
          {/*  <Image*/}
          {/*    source={require('../../../assets/reward-3.jpeg')}*/}
          {/*    style={styles.img3}*/}
          {/*  />*/}
          {/*  <Text style={styles.text3}>*/}
          {/*    /!* {*/}
          {/*      "You receive a reward of AED 10, when they book a service of AED 100 or More."*/}
          {/*    } *!/*/}
          {/*    {I18n.t('howPt3')}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {/*<View style={styles.row2}>*/}
          {/*  <Image*/}
          {/*    source={require('../../../assets/reward-4.png')}*/}
          {/*    style={styles.img4}*/}
          {/*  />*/}
          {/*  <Text style={styles.text3}>*/}
          {/*    /!* {*/}
          {/*      "Share Your purchase with 3 friends and you will get AED 10 in your wallet"*/}
          {/*    } *!/*/}
          {/*    {I18n.t('howPt4')}*/}
          {/*  </Text>*/}
          {/*</View>*/}
        </View>
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  containerRow: {
    // backgroundColor: 'rgba(33, 109, 158, 0.3)',
    backgroundColor: 'rgba(238, 242, 40, 0.3)',
  },
  containerRow1: {
    flexDirection: 'row',
    padding: RFValue(15),
  },
  gift: {
    width: RFValue(80),
    height: RFValue(80),
  },
  ref: {
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconStyle: {
    backgroundColor: Colors.white,
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(100),
  },
  iconName: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: RFValue(20),
    paddingTop: RFValue(5),
  },
  containerStyle1: {
    marginHorizontal: RFValue(15),
  },
  heading2: {
    fontWeight: 'bold',
    paddingVertical: RFValue(10),
  },
  row1: {
    flexDirection: 'row',
  },
  row2: {
    flexDirection: 'row',
    marginVertical: RFValue(10),
  },
  text1: {
    fontSize: RFValue(12.5),
    flex: 1,
    flexWrap: 'wrap',
  },
  text2: {
    fontSize: RFValue(12.5),
    paddingTop: RFValue(20),
    flex: 1,
    flexWrap: 'wrap',
  },
  text3: {
    fontSize: RFValue(12.5),
    flex: 1,
    flexWrap: 'wrap',
  },
  text4: {
    marginVertical: RFValue(10),
    paddingHorizontal: RFValue(15),
    flex: 1,
    flexWrap: 'wrap',
    fontSize: RFValue(12.5),
  },
  img1: {
    width: RFValue(35),
    height: RFValue(35),
    marginHorizontal: RFValue(10),
  },
  img2: {
    width: RFValue(55),
    height: RFValue(60),
  },
  img3: {
    width: RFValue(38),
    height: RFValue(38),
    marginHorizontal: RFValue(10),
    borderRadius: RFValue(100),
  },
  img4: {
    width: RFValue(35),
    height: RFValue(35),
    marginHorizontal: RFValue(10),
  },
});

export default RewardScreen;
