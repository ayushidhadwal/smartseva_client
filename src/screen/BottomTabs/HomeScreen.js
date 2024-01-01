import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  StatusBar,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Title, Button} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Categories from '../../components/Categories';
import {URL} from '../../constants/base_url';
import * as userActions from '../../store/actions/user';
import * as homeAction from '../../store/actions/home';
import {SearchHeader} from '../../components/home/SearchHeader';
import I18n from '../../languages/I18n';

const HOME_BANNER = require('../../../assets/Homebanner.jpg');
const IMAGE_SLIDER = [
  'https://image.freepik.com/free-photo/female-hairdresser-using-hairbrush-hair-dryer_329181-1929.jpg',
  'https://img.freepik.com/free-photo/man-disinfects-his-apartment-protective-suit-protection-against-covid-19-disease-prevention-spread-pneumonia-virus-surface-concept-chemical-disinfection-against-viruses_359992-40.jpg?size=626&ext=jpg',
  'https://img.freepik.com/free-photo/professional-overalls-with-tools-background-repair-site-home-renovation-concept_169016-7323.jpg?size=626&ext=jpg',
  'https://img.freepik.com/free-photo/technician-service-removing-air-filter-air-conditioner-cleaning_35076-3618.jpg?size=626&ext=jpg',
];

const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const setHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(userActions.get_user_profile());
      await dispatch(homeAction.setServiceType());
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setHomeData);
    return () => unsubscribe;
  }, [navigation, setHomeData]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView edges={['right', 'top', 'left']} style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SearchHeader
        onLocationPress={() => navigation.navigate('AddressBook')}
        onSearchPress={() => navigation.navigate('AllService')}
      />

      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ededed'}}>
          <Categories
            onCategoryPress={(serviceId, serviceName) =>
              navigation.navigate('SubCategories', {
                serviceId,
                serviceName,
              })
            }
          />

          {/* Image Slider Start~ */}
          <View style={styles.categorySection1}>
            <Swiper height={RFValue(200)} autoplay activeDotColor="#000">
              {IMAGE_SLIDER.map((slide, i) => (
                <View style={styles.sliderContainer} key={i.toString()}>
                  <Image
                    source={{
                      uri: slide,
                    }}
                    style={styles.sliderBanner}
                  />
                </View>
              ))}
            </Swiper>
          </View>
          {/* Image Slider Ends~ */}

          {/* Home Banner Start~ */}
          <View style={styles.imgContainer}>
            <Image source={HOME_BANNER} style={styles.banner} />
          </View>
          {/* Home Banner Ends~ */}

          {/* Testimonials Start~ */}
          <View style={styles.categorySection4}>
            <Title>{I18n.t('custSafety')}</Title>
            <Text>{I18n.t('whatCustSay')}</Text>
            {/*<Swiper*/}
            {/*  height={Platform.OS === 'ios' ? RFValue(250) : RFValue(220)}>*/}
            {/*  {testimonial.map((item, index) => (*/}
            {/*    <View style={styles.reviewRow} key={index.toString()}>*/}
            {/*      <View style={{flexDirection: 'row'}}>*/}
            {/*        <Image*/}
            {/*          source={{uri: URL + item.photo}}*/}
            {/*          style={styles.userImg}*/}
            {/*        />*/}
            {/*        <View*/}
            {/*          style={{*/}
            {/*            alignItems: 'center',*/}
            {/*          }}>*/}
            {/*          <Text style={styles.userReview}>{item.name}</Text>*/}
            {/*          <Text*/}
            {/*            style={{*/}
            {/*              color: Colors.primary,*/}
            {/*            }}>*/}
            {/*            {dayjs(item.created_at).format('DD MMM YYYY , hh:mm a')}*/}
            {/*          </Text>*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*      <View style={{flexDirection: 'row', paddingTop: RFValue(10)}}>*/}
            {/*        <Ionicons*/}
            {/*          name="md-star"*/}
            {/*          size={20}*/}
            {/*          color={item.rating !== 0 ? Colors.darkYellow : 'grey'}*/}
            {/*          style={styles.icon}*/}
            {/*        />*/}
            {/*        <Ionicons*/}
            {/*          name="md-star"*/}
            {/*          size={20}*/}
            {/*          color={item.rating >= 2 ? Colors.darkYellow : 'grey'}*/}
            {/*          style={styles.icon}*/}
            {/*        />*/}
            {/*        <Ionicons*/}
            {/*          name="md-star"*/}
            {/*          size={20}*/}
            {/*          color={item.rating >= 3 ? Colors.darkYellow : 'grey'}*/}
            {/*          style={styles.icon}*/}
            {/*        />*/}
            {/*        <Ionicons*/}
            {/*          name="md-star"*/}
            {/*          size={20}*/}
            {/*          color={item.rating >= 4 ? Colors.darkYellow : 'grey'}*/}
            {/*          style={styles.icon}*/}
            {/*        />*/}
            {/*        <Ionicons*/}
            {/*          name="md-star"*/}
            {/*          size={20}*/}
            {/*          color={item.rating >= 5 ? Colors.darkYellow : 'grey'}*/}
            {/*          style={styles.icon}*/}
            {/*        />*/}
            {/*      </View>*/}
            {/*      <Text*/}
            {/*        style={{*/}
            {/*          color: Colors.primary,*/}
            {/*        }}*/}
            {/*        numberOfLines={3}>*/}
            {/*        {item.comment}*/}
            {/*      </Text>*/}
            {/*    </View>*/}
            {/*  ))}*/}
            {/*</Swiper>*/}
          </View>
          {/* Testimonials Ends~ */}

          {/* Refer to Win Start~ */}
          <Pressable
            style={styles.categorySection3}
            onPress={() => navigation.navigate('Reward')}>
            <Image
              source={require('../../../assets/gift.png')}
              style={{width: RFValue(35), height: RFValue(35)}}
            />
            <View>
              <Text style={{fontWeight: 'bold', fontSize: RFValue(15)}}>
                {I18n.t('refer')}
              </Text>
              <Text>{I18n.t('referMsg')}</Text>
            </View>
            <Ionicons
              name={'caret-forward'}
              size={24}
              color="black"
              style={{alignSelf: 'flex-end', paddingBottom: RFValue(8)}}
            />
          </Pressable>
          {/* Refer to Win Ends~ */}

          {/* Insurance protection program start~ */}
          <View style={styles.categorySection2}>
            <Image
              source={require('../../../assets/shield.png')}
              style={styles.shield}
            />
            <View style={{flex: 1, paddingLeft: RFValue(15)}}>
              <Title style={{fontWeight: 'bold', paddingBottom: RFValue(5)}}>
                {I18n.t('servGoInsu')}
              </Title>
              <Text>
                {/* Upto AED 2500 insurance protection with every service request */}
                {I18n.t('servGoInsuMsg')}
              </Text>
              <Text
                style={styles.learnMore}
                onPress={() => Linking.openURL(URL)}>
                {I18n.t('learnMore')}
              </Text>
            </View>
          </View>
          {/* Insurance protection program end~ */}

          {/* Anti discrimination policy start~ */}
          <View style={styles.categorySection2}>
            <View style={{flex: 1, paddingRight: RFValue(15)}}>
              <Title style={{fontWeight: 'bold'}}>{I18n.t('antiDisc')}</Title>
              <Text>{I18n.t('antiDiscMsg')}</Text>
              <Button
                mode="outlined"
                style={styles.Know}
                onPress={() => Linking.openURL(URL)}>
                {I18n.t('knowMoreBtn')}
              </Button>
            </View>
            <Image
              source={require('../../../assets/heart.png')}
              style={styles.respect}
            />
          </View>
          {/* Anti discrimination policy ends~ */}
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
  numberOfBooking: {
    flexDirection: 'row',
    marginBottom: RFValue(10),
    padding: RFValue(8),
    backgroundColor: Colors.white,
  },
  numberOfBookingText: {
    fontSize: RFValue(13),
    paddingLeft: RFValue(10),
    fontWeight: 'bold',
  },
  slider: {
    marginBottom: RFValue(10),
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('15%'),
    marginBottom: RFValue(10),
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categorySection: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
  },
  categorySection1: {
    paddingHorizontal: RFValue(15),
    paddingTop: RFValue(10),
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
  },
  categorySection4: {
    paddingHorizontal: RFValue(15),
    paddingTop: RFValue(10),
    backgroundColor: Colors.white,
  },
  categorySection2: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.white,
    marginBottom: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categorySection3: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.white,
    marginVertical: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(10),
  },
  categoryImg: {
    width: wp('43%'),
    height: hp('15%'),
    // resizeMode:"contain"
  },
  categoryImg1: {
    width: wp('43%'),
    height: hp('15%'),
    resizeMode: 'contain',
  },
  heading2: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
    paddingTop: RFValue(5),
  },
  wrapper: {},
  slide1: {},
  userReview: {
    paddingLeft: RFValue(5),
    fontSize: RFValue(17),
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userImg: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(100),
  },
  reviewRow: {
    borderWidth: RFValue(5),
    padding: RFValue(15),
    marginVertical: RFValue(10),
    borderRadius: RFValue(10),
    borderColor: '#d9edfa',
  },
  shield: {
    width: RFValue(70),
    height: RFValue(80),
    marginTop: RFValue(12),
  },
  learnMore: {
    fontWeight: 'bold',
    color: Colors.primary,
    paddingVertical: RFValue(8),
    fontSize: RFValue(15),
  },
  Know: {
    width: '60%',
    alignSelf: 'flex-start',
    marginVertical: RFValue(15),
  },
  respect: {
    width: RFValue(70),
    height: RFValue(70),
    marginTop: RFValue(5),
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
  remove: {marginBottom: RFValue(25)},
});

export default HomeScreen;
