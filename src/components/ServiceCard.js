import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {SUB_IMG_URL} from '../constants/base_url';
import {RFValue} from 'react-native-responsive-fontsize';
import Colors from '../constants/Colors';
import React, {useCallback, useEffect, useState} from 'react';
import * as homeAction from '../store/actions/home';
import {useDispatch} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const ServiceCard = ({
  onPressHandler,
  image,
  name,
  desc,
  price,
  serviceId,
  subServiceId,
  navigation,
}) => {
  const dispatch = useDispatch();

  const [cartLoader, setCartLoader] = useState(false);
  const [error, setError] = useState(null);

  const addToCartHandler = useCallback(async () => {
    setCartLoader(true);
    setError(null);
    try {
      await dispatch(homeAction.addToCart(serviceId, subServiceId));
      alert('Service added to cart successfully');
      await dispatch(homeAction.getCart(serviceId));
    } catch (e) {
      setError(e.message);
    }
    setCartLoader(false);
  }, [dispatch, serviceId, subServiceId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <Pressable onPress={onPressHandler}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View style={styles.image}>
            <Image style={styles.img} source={{uri: image}} />
          </View>
          <View>
            <View>
              <Text style={styles.category}>{name}</Text>
              {desc !== null && <Text>{' - ' + desc}</Text>}
            </View>
          </View>
        </View>
        <View>
          <Text>₹ {price}</Text>
          {cartLoader ? (
            <View style={{marginTop: 5}}>
              <ActivityIndicator size={16} />
            </View>
          ) : (
            <Pressable style={styles.addToCartBtn} onPress={addToCartHandler}>
              <Text style={{fontSize: 12, color: 'white', padding: 2}}>
                Add to Cart
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: RFValue(15),
    borderRadius: RFValue(5),
    padding: RFValue(8),
    marginHorizontal: RFValue(10),
    justifyContent: 'space-between',
  },
  image: {
    height: 50,
    width: '20%',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  addToCartBtn: {
    backgroundColor: Colors.darkYellow,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    padding: 2,
    borderRadius: 5,
  },
});

export default ServiceCard;
