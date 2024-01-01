import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  SafeAreaView,
  Share,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Divider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import {androidPackageName, androidPackagePartner} from '../../constants/common';
import I18n from '../../languages/I18n';

const ProfileRow = ({onPress, title, icon}) => (
  <>
    <Pressable style={styles.rowStyle} onPress={onPress}>
      <Ionicons
        name={icon}
        size={RFValue(22)}
        color={Colors.grey}
        style={styles.icon}
      />
      <Text style={styles.rowText}>{title}</Text>
    </Pressable>
    <Divider />
  </>
);

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {Profile} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logoutHandler = useCallback(async () => {
    setError(null);
    try {
      await dispatch(authActions.logout());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const setProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(userActions.get_user_profile());
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setProfile);
    return () => unsubscribe;
  }, [navigation, setProfile]);

  const _onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `https://play.google.com/store/apps/details?id=${androidPackageName}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <View style={styles.containerStyle}>
        <Text style={styles.heading}>Settings</Text>
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={{backgroundColor: Colors.white}}>
          {/* Profile Info Card Start~ */}
          <View style={styles.containerRow1}>
            <View>
              <Text style={styles.verify}>{I18n.t('verifyCust')}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text>{Profile.phone_code} </Text>
                <Text>{Profile.mobile}</Text>
              </View>
            </View>
            <Ionicons
              name="create"
              size={RFValue(24)}
              color={Colors.grey}
              style={{paddingTop: RFValue(10)}}
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>
          {/* Profile Info Card End~ */}

          <View style={{marginVertical: RFValue(20)}}>
            <ProfileRow
              onPress={() => navigation.navigate('EditProfile')}
              title={I18n.t('mangProfile')}
              icon="person"
            />
            <ProfileRow
              onPress={() => navigation.navigate('AddressBook')}
              title={I18n.t('addressBook')}
              icon="location-sharp"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Wallet')}
              title={I18n.t('myWallet')}
              icon="wallet"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Password')}
              title={I18n.t('security')}
              icon="shield-checkmark"
            />
            <ProfileRow
              onPress={() => navigation.navigate('about')}
              title={I18n.t('aboutUs')}
              icon="information-circle"
            />
            <ProfileRow
              onPress={_onShare}
              title="Share SMARTSEVA"
              icon="share"
            />
            <ProfileRow
              onPress={() => navigation.navigate('help')}
              title={I18n.t('help')}
              icon="help-buoy"
            />
            <ProfileRow
              onPress={() => navigation.navigate('ServiceList')}
              title={I18n.t('raise')}
              icon="alert-circle"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Review')}
              title={I18n.t('rateUs')}
              icon="star"
            />
            <ProfileRow
              onPress={() =>
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? `https://play.google.com/store/apps/details?id=${androidPackagePartner}`
                    : `https://play.google.com/store/apps/details?id=${androidPackagePartner}`,
                )
              }
              title={'Download SMARTSEVA Partner App'}
              icon="download-outline"
            />
          </View>

          {/* Logout Button */}
          <Button mode="outlined" style={styles.btn} onPress={logoutHandler}>
            {I18n.t('logout')}
          </Button>
          {/* Logout Button End~ */}
        </ScrollView>
      )}
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
  containerRow1: {
    backgroundColor: 'rgba(238, 242, 40, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(15),
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  rowText: {
    fontSize: RFValue(14),
  },
  icon: {
    paddingRight: RFValue(15),
  },
  btn: {
    width: '60%',
    alignSelf: 'center',
    marginVertical: RFValue(15),
  },
  verify: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: RFValue(10),
  },
  rowTitle: {
    fontSize: RFValue(15),
    paddingLeft: RFValue(10),
    paddingVertical: RFValue(10),
  },
});

export default ProfileScreen;
