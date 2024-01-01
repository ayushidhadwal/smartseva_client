import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import Colors from '../constants/Colors';
import {Button, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import * as homeAction from '../store/actions/home';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Loader} from '../components/common/Loader';
import Octicons from 'react-native-vector-icons/Octicons';

const CartScreen = ({navigation, route}) => {
  const serviceId = route.params.serviceId;
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState('');
  const dispatch = useDispatch();
  const {cartList} = useSelector(state => state.home);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(homeAction.getCart(serviceId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, navigation, serviceId]);

  const deleteCart = async (cartId, price) => {
    try {
      await dispatch(homeAction.deleteCart(cartId, price));
      await dispatch(homeAction.getCart(serviceId));
    } catch (e) {
      setError(e.message);
    }
  };

  const addHandler = async (id, qty) => {
    try {
      await dispatch(homeAction.updateCart(id, qty + 1));
    } catch (e) {
      setError(e.message);
    }
  };

  const minusHandler = async (id, qty) => {
    if (qty === 1) {
      setError(
        'Quantity must not be less than 1. Please Delete Service in order to remove.',
      );
      return;
    }
    try {
      await dispatch(homeAction.updateCart(id, qty - 1));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      {cartList.items.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 0.9}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cartList.items.map(cartData => {
                return (
                  <View key={cartData.id}>
                    <View style={styles.container}>
                      <View style={styles.nameContainer}>
                        <View>
                          <Pressable
                            onPress={() =>
                              deleteCart(cartData.id, cartData.price)
                            }>
                            <Ionicons
                              name={'close-circle'}
                              size={24}
                              color={'red'}
                            />
                          </Pressable>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flex: 1,
                            marginLeft: 10,
                          }}>
                          <View style={{flexShrink: 1}}>
                            <Text style={{fontWeight: 'bold'}}>
                              {cartData.service_name}
                            </Text>
                            <Text>{cartData.subservice_name}</Text>
                          </View>
                          <View>
                            <Text>₹ {cartData.price}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: Colors.darkYellow,
                              paddingHorizontal: 5,
                              paddingVertical: 3,
                              borderRadius: 20,
                              width: '20%',
                              justifyContent: 'space-between',
                            }}>
                            <Pressable
                              onPress={() =>
                                addHandler(cartData.id, cartData.qty)
                              }>
                              <Ionicons name="add" size={18} color="black" />
                            </Pressable>
                            <Text>{cartData.qty} </Text>
                            <Pressable
                              onPress={() =>
                                minusHandler(cartData.id, cartData.qty)
                              }>
                              <Octicons name="dash" size={16} color="black" />
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Divider />
                  </View>
                );
              })}
              {cartList.convenienceFee > 0 ? (
                <View>
                  <View style={styles.container}>
                    <View style={styles.nameContainer}>
                      <Pressable>
                        <Ionicons
                          name={'close-circle'}
                          size={24}
                          color={'white'}
                        />
                      </Pressable>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flex: 1,
                          marginLeft: 10,
                        }}>
                        <View style={{flexShrink: 1}}>
                          <Text style={{fontWeight: 'bold'}}>
                            Convenience Fees
                          </Text>
                        </View>

                        <View>
                          <Text>₹ {cartList.convenienceFee}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Divider />
                </View>
              ) : null}
            </ScrollView>
          </View>

          <View style={styles.bottomBtn}>
            <Text style={styles.totalAmt}>₹ {cartList.total}</Text>
            <Button
              mode="text"
              labelStyle={{color: Colors.white}}
              onPress={() =>
                navigation.navigate('AddressList', {
                  service: serviceId,
                  cartTotal: cartList.total,
                  convenienceFee: cartList.convenienceFee,
                })
              }>
              Continue
            </Button>
          </View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('../../assets/cart.jpg')}
            style={{width: 200, height: 200, resizeMode: 'contain'}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            Your cart is empty.
          </Text>
          <Button
            style={{marginTop: 10}}
            mode={'contained'}
            onPress={() => navigation.navigate('Home')}>
            Continue
          </Button>
        </View>
      )}
    </View>
  );
};
('');
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomBtn: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(8),
    alignItems: 'center',
    flex: 0.1,
  },
  totalAmt: {
    paddingTop: RFValue(7),
    color: Colors.white,
    paddingLeft: RFValue(20),
    fontWeight: 'bold',
  },
  content1: {
    backgroundColor: Colors.white,
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(15),
    flexDirection: 'row',
  },
  listTitle: {
    fontWeight: 'bold',
    paddingBottom: RFValue(3),
  },
  row1: {flexDirection: 'row'},
  content2: {
    flexDirection: 'row',
    marginVertical: RFValue(25.5),
    marginLeft: RFValue(15),
  },
  btn: {
    flexDirection: 'row',
    borderWidth: RFValue(1),
    borderColor: Colors.primary,
  },
  remove: {
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
  qty: {
    alignSelf: 'center',
    paddingHorizontal: RFValue(5),
  },
  price: {
    alignSelf: 'center',
    paddingHorizontal: RFValue(5),
    fontWeight: 'bold',
  },
  content3: {
    backgroundColor: Colors.white,
    paddingVertical: RFValue(10),
    marginVertical: RFValue(10),
  },
  title: {
    paddingHorizontal: RFValue(10),
  },
  cardContainer: {
    width: RFValue(120),
    flex: 1,
    marginVertical: RFValue(8),
    marginLeft: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imgContainer: {
    width: '100%',
    height: RFValue(100),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cost: {
    marginVertical: RFValue(10),
    fontWeight: 'bold',
  },
  add: {
    marginBottom: RFValue(15),
    // width: '60%',
  },
  content4: {
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
    padding: RFValue(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content5: {
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
    paddingVertical: RFValue(15),
  },
  content6: {
    backgroundColor: Colors.white,
    marginTop: RFValue(10),
    padding: RFValue(15),
  },
  include: {
    color: Colors.grey,
  },
  priceInfo: {
    color: Colors.grey,
    flex: 1,
    flexWrap: 'nowrap',
  },
  row2: {
    flexDirection: 'row',
  },
  percent: {
    paddingTop: RFValue(8),
  },
  offerTxt: {
    paddingHorizontal: RFValue(15),
  },
  promo: {fontSize: RFValue(14)},
  offer: {
    color: Colors.grey,
    fontSize: RFValue(12),
  },
  tip: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    paddingHorizontal: RFValue(15),
  },
  row3: {
    flexDirection: 'row',
    marginVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
  },
  info: {
    color: Colors.grey,
    fontStyle: 'italic',
    paddingHorizontal: RFValue(15),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(15),
  },
  text2: {
    color: Colors.grey,
    fontSize: RFValue(14),
  },
  rowContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  total: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
  container: {
    backgroundColor: 'white',
    // elevation: 3,
    flexDirection: 'row',
    paddingHorizontal: RFValue(20),
    padding: RFValue(10),
  },
  image: {
    height: 50,
    width: '20%',
  },
  nameContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  categoty: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CartScreen;
