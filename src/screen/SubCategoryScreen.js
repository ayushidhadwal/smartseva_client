import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Title} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import * as homeAction from '../store/actions/home';
import {SUB_IMG_URL} from '../constants/base_url';
import Colors from '../constants/Colors';
import I18n from '../languages/I18n';
import ServiceCard from '../components/ServiceCard';

const SubCategoryScreen = ({route, navigation}) => {
  const {serviceId, serviceName} = route.params;

  const {subServices, cartList} = useSelector(state => state.home);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(homeAction.set_sub_service(serviceId));
        await dispatch(homeAction.getCart(serviceId));
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return () => unsubscribe;
  }, [serviceId, navigation, dispatch]);

  console.log('cartList.items', cartList.items);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: cartList.items.length > 0 ? 0.9 : 1}}>
        <ScrollView style={styles.screen}>
          <View style={styles.categorySection1}>
            <Swiper height={RFValue(200)} autoplay activeDotColor="#ffff">
              <View style={styles.sliderContainer}>
                <Image
                  source={require('../../assets/electrical1.jpg')}
                  style={styles.sliderBanner}
                />
              </View>
              <View style={styles.sliderContainer}>
                <Image
                  source={{
                    uri: 'https://image.freepik.com/free-photo/portrait-electrician-work_53419-6965.jpg',
                  }}
                  style={styles.sliderBanner}
                />
              </View>
              <View style={styles.sliderContainer}>
                <Image
                  source={{
                    uri: 'https://t4.ftcdn.net/jpg/04/28/76/39/240_F_428763930_1CsAmqLUk8ADAwmk44k3JM71F5HuJXXB.jpg',
                  }}
                  style={styles.sliderBanner}
                />
              </View>
              <View style={styles.sliderContainer}>
                <Image
                  source={{
                    uri: 'https://image.freepik.com/free-photo/male-technician-overalls-blue-cap-repairs-air-conditioner-wall_353017-466.jpg',
                  }}
                  style={styles.sliderBanner}
                />
              </View>
              <View style={styles.sliderContainer}>
                <Image
                  source={{
                    uri: 'https://img.freepik.com/free-photo/professional-overalls-with-tools-background-repair-site-home-renovation-concept_169016-7323.jpg?size=626&ext=jpg',
                  }}
                  style={styles.sliderBanner}
                />
              </View>
            </Swiper>
            <Text style={styles.heading}>{serviceName}</Text>
          </View>
          <Title style={styles.header}>{I18n.t('subCatTitle')}</Title>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            />
          ) : subServices.length === 0 ? (
            <Text
              style={{
                fontSize: RFValue(15),
                textAlign: 'center',
                marginBottom: RFValue(20),
                fontWeight: 'bold',
                color: Colors.primary,
              }}>
              No Service Available
            </Text>
          ) : (
            <View style={styles.gridView}>
              {subServices.map((item, index) => (
                <ServiceCard
                  key={index}
                  image={SUB_IMG_URL + item.image}
                  name={item.subcategory_name}
                  price={item.service_price}
                  desc={item.child_cat}
                  serviceId={serviceId}
                  subServiceId={item.id}
                  {...navigation}
                />
              ))}
            </View>
          )}
          <View style={styles.content1}>
            <Title style={styles.title}>{I18n.t('bestInClass')}</Title>
            <View style={styles.rowContent}>
              <View style={styles.rowContent1}>
                <Image
                  source={require('../../assets/mask.png')}
                  style={styles.imgIcon}
                />
                <Text style={styles.textIcon}>{I18n.t('maskMsg')}</Text>
              </View>
              <View style={styles.rowContent1}>
                <Image
                  source={require('../../assets/thermometer.png')}
                  style={styles.imgIcon}
                />
                <Text style={styles.textIcon}>{I18n.t('tempMsg')}</Text>
              </View>
              <View style={styles.rowContent1}>
                <Image
                  source={require('../../assets/sanitization.png')}
                  style={styles.imgIcon}
                />
                <Text style={styles.textIcon}>{I18n.t('santizeMsg')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.content1}>
            <Title style={styles.title}>{I18n.t('transPrice')}</Title>
            <View style={styles.rowContent2}>
              <Entypo name="dot-single" size={45} color={Colors.grey} />
              <Text style={styles.text1}>{I18n.t('pricePt1')}</Text>
            </View>
            <View style={styles.rowContent2}>
              <Entypo name="dot-single" size={45} color={Colors.grey} />
              <Text style={styles.text1} numberOfLines={2}>
                {/* Spare parts are charged as per market price. */}
                {I18n.t('pricePt2')}
              </Text>
            </View>
            <View style={styles.rowContent2}>
              <Entypo name="dot-single" size={45} color={Colors.grey} />
              <Text style={styles.text1}>
                {/* A AED 100 procurement fee is charged when our partner fetches spare
            parts as part of the service. */}
                {I18n.t('pricePt3')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      {cartList.items.length > 0 ? (
        <Pressable
          style={{
            flex: 0.1,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Cart', {serviceId: serviceId})}>
          <Text style={{fontWeight: 'bold'}}>GO TO CART</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  icons: {
    width: RFValue(35),
    height: RFValue(35),
    alignSelf: 'center',
  },
  iconName: {
    textAlign: 'center',
    paddingTop: RFValue(5),
    fontSize: RFValue(12),
  },
  title: {
    padding: RFValue(10),
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  heading2: {
    paddingVertical: RFValue(10),
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  categorySection1: {
    paddingHorizontal: RFValue(15),
    paddingTop: RFValue(10),
    backgroundColor: Colors.primary,
  },
  sliderBanner: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  sliderContainer: {
    width: wp('100%'),
    height: hp('22%'),
  },
  numberOfBooking: {
    flexDirection: 'row',
    padding: RFValue(8),
    backgroundColor: Colors.white,
  },
  numberOfBookingText: {
    fontSize: RFValue(13),
    paddingLeft: RFValue(10),
    fontWeight: 'bold',
  },
  heading: {
    textAlign: 'center',
    paddingBottom: RFValue(5),
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: Colors.white,
  },
  content1: {
    paddingHorizontal: RFValue(10),
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
    paddingVertical: RFValue(15),
  },
  rowContent: {
    flexDirection: 'row',
    margin: RFValue(15),
    justifyContent: 'space-between',
  },
  rowContent1: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  imgIcon: {
    width: RFValue(30),
    height: RFValue(30),
  },
  textIcon: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowContent2: {
    flexDirection: 'row',
    marginRight: RFValue(15),
  },
  text1: {
    fontSize: RFValue(13),
    paddingTop: RFValue(10),
    flex: 1,
    flexWrap: 'wrap',
  },
  content2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: RFValue(10),
  },
  row2: {
    flexDirection: 'row',
    marginBottom: RFValue(10),
  },
  subRow: {paddingLeft: RFValue(15)},
  subHeading: {fontWeight: 'bold', fontSize: RFValue(15)},
  review: {fontSize: RFValue(10)},
  header: {
    marginTop: RFValue(12),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: RFValue(15),
  },
  container: {
    backgroundColor: Colors.white,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: RFValue(15),
    borderRadius: RFValue(5),
    padding: RFValue(8),
    // alignItems: 'center',
    // width: '93%',
    // alignSelf: 'center',
    marginHorizontal: RFValue(10),
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
  category: {
    fontWeight: 'bold',
  },
});

export const screenOptions = ({route}) => ({
  headerTitle: route.params.serviceName,
});

export default SubCategoryScreen;
