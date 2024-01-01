import React, {useEffect, useState} from 'react';
import {Alert, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import * as addressActions from '../../store/actions/address';
import I18n from '../../languages/I18n';

export const SearchHeader = ({onLocationPress, onSearchPress}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locate, setLocate] = useState('');
  const {addresses} = useSelector(state => state.address);

  const dispatch = useDispatch();

  const _getAddresses = async () => {
    try {
      setError(null);
      setLoading(true);
      await dispatch(addressActions.setAddresses());
    } catch (e) {
      // setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getAddresses().then(() => null);
  }, []);

  useEffect(() => {
    const add = addresses.find(m => m.isDefault === true);
    if (add) {
      setLocate({...add});
    }
  }, [addresses]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.headerContainer}>
      <Pressable style={styles.locationRow} onPress={onLocationPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name={'location-sharp'}
            size={RFValue(16)}
            color={Colors.white}
          />
          <Text numberOfLines={1} style={styles.address}>
            {locate.isDefault
              ? locate.address + ',' + locate.city + ',' + locate.country
              : 'Please add your address...'}
          </Text>
        </View>
        <Ionicons
          name={'caret-down'}
          size={RFValue(13)}
          color={Colors.white}
        />
      </Pressable>

      <Pressable
        onPress={onSearchPress}
        style={{
          width: '95%',
          backgroundColor: Colors.white,
          alignSelf: 'center',
          padding: RFValue(4),
        }}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name={'search'}
            size={RFValue(20)}
            color="grey"
          />
          <Text
            style={{
              alignSelf: 'center',
              fontSize: RFValue(15),
              paddingHorizontal: RFValue(5),
              color: 'gray',
            }}>
            {I18n.t('searchTitle')}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingBottom: RFValue(12),
    paddingTop: RFValue(10),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(8),
  },
  address: {
    color: Colors.secondary,
    fontSize: RFValue(13),
    padding: RFValue(5),
    width: '85%',
  },
});
