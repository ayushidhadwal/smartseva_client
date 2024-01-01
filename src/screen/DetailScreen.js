import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Button,
  Checkbox,
  Divider,
  Subheading,
  TextInput,
  Title,
} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';

import Colors from '../constants/Colors';
import * as requestAction from '../store/actions/request';
import ProviderRating from '../components/ProviderRating';
import {PROVIDER_GALLERY} from '../constants/base_url';
import I18n from '../languages/I18n';

const DetailScreen = ({route, navigation}) => {
  const {
    partner_id,
    bookingDate,
    bookingTime,
    qty,
    address_id,
    serviceId,
    selectedId,
  } = route.params;

  const {providerProfile, subService_provider, service_provider} = useSelector(
    state => state.request,
  );

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [img, setImg] = useState();

  const dispatch = useDispatch();

  const {service_pricing} = providerProfile;

  useEffect(() => {
    const servicePricing = service_pricing.find(
      item => Number(selectedId) === Number(item.id),
    );

    if (servicePricing) {
      setForm([
        {
          serviceId: servicePricing.id.toString(),
          price: servicePricing.service_price,
          qty: qty.toString(),
        },
      ]);
    }
  }, [service_pricing, qty, selectedId]);

  const quantity = form.map(item => item.qty);
  const price = form.map(item => item.price);
  const serviceIdArray = form.map(item => item.serviceId);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(
          requestAction.get_service_provider_profile(
            partner_id,
            bookingDate,
            bookingTime,
            qty,
            address_id,
            serviceId,
          ),
        );
        await dispatch(requestAction.get_service_provider_review(partner_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  const _onSubmitHandler = useCallback(async () => {
    if (serviceIdArray.length === 0) {
      setError('Please Select at least 1 service!!!');
      return;
    }
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.request_service(
          partner_id,
          serviceIdArray,
          bookingDate,
          bookingTime,
          price,
          quantity,
          service_provider[0].total_price,
          address_id,
          instructions,
        ),
      );
      Alert.alert('Alert', ' Booking Sent Successfully !!!', [
        {text: 'OK', onPress: () => navigation.navigate('ServiceReq')},
      ]);
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  }, [
    serviceIdArray,
    dispatch,
    partner_id,
    bookingDate,
    bookingTime,
    price,
    quantity,
    service_provider,
    address_id,
    instructions,
    navigation,
  ]);

  const _onSelectHandler = (id, charges) => {
    setForm(prevState => {
      const x = [...prevState];
      const i = x.findIndex(n => n.serviceId === id);
      if (i >= 0) {
        x.splice(i, 1);
      } else {
        x.push({
          serviceId: id,
          price: charges,
          qty: '1',
        });
      }
      return x;
    });
  };

  const inputChange = (text, id) => {
    setForm(prevState => {
      const ab = [...prevState];
      const x = ab.findIndex(i => i.serviceId === id);
      if (x >= 0) {
        ab[x].qty = text;
      }
      return ab;
    });
  };

  const result = providerProfile.gallery.map(m => ({
    url: PROVIDER_GALLERY + m.image_path,
  }));

  return (
    <ScrollView style={styles.screen}>
      {loading ? (
        <ActivityIndicator
          style={{flex: 1, alignSelf: 'center', marginVertical: RFValue(250)}}
          color={Colors.primary}
          size="large"
        />
      ) : (
        <>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri: PROVIDER_GALLERY + providerProfile.profile.photo,
              }}
              style={styles.img}
            />
          </View>
          <Text style={styles.company_name}>
            {providerProfile.profile.company_name}
          </Text>
          <Title style={styles.heading1}>{I18n.t('overview')} :</Title>
          <Text style={styles.text1}>{providerProfile.profile.overview}</Text>
          <Title style={styles.heading1}>{I18n.t('moreService')} : </Title>
          {providerProfile.services.map((item, id) => (
            <View key={id} style={styles.star}>
              <Checkbox
                status="checked"
                color={Colors.primary}
                position="leading"
              />
              <Text style={styles.service_name}>{item.service_name}</Text>
            </View>
          ))}
          <Title style={styles.heading2}>{I18n.t('prices')} : </Title>
          <Divider style={styles.line} />
          {providerProfile.service_pricing.map((item, index) => (
            <View
              key={index}
              style={[
                styles.price,
                {backgroundColor: index % 2 ? '#fff' : '#f9f9f9'},
              ]}>
              <View style={styles.content3}>
                <Text style={styles.text2}>
                  {item.main_cat} - {item.subcategory_name}
                  {item.child_cat !== null ? ' - ' + item.child_cat : null}
                </Text>
              </View>
              <View style={styles.content3}>
                <Text style={styles.text3}>
                  {'₹ '}
                  {item.id === subService_provider.id
                    ? service_provider[0].total_price
                    : item.service_price}
                </Text>
              </View>
              <Text style={styles.description}>{item.service_desc}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Checkbox.Android
                    status={
                      form.find(
                        element => element.serviceId === item.id.toString(),
                      )
                        ? 'checked'
                        : 'unchecked'
                    }
                    color={Colors.primary}
                    onPress={() =>
                      _onSelectHandler(item.id.toString(), item.service_price)
                    }
                  />
                  <Text style={{fontSize: RFValue(13)}}>{I18n.t('add')}</Text>
                </View>
                {form.find(
                  element => element.serviceId === item.id.toString(),
                ) ? (
                  <TextInput
                    mode="outlined"
                    label={I18n.t('qtyTable')}
                    style={{
                      width: '20%',
                      textAlign: 'center',
                      marginRight: RFValue(15),
                    }}
                    dense
                    value={
                      form.find(
                        element => element.serviceId === item.id.toString(),
                      ).qty
                    }
                    onChangeText={text => inputChange(text, item.id.toString())}
                    keyboardType="numeric"
                  />
                ) : null}
              </View>
            </View>
          ))}
          <Divider />
          <View style={{padding: RFValue(10)}}>
            <Subheading>{I18n.t('instIfAny')}</Subheading>
            <TextInput
              label={I18n.t('writeInst')}
              mode="outlined"
              multiline={true}
              style={styles.inputBox}
              value={instructions}
              onChangeText={setInstructions}
            />
            <Button
              mode="contained"
              style={{
                width: '80%',
                marginVertical: RFValue(20),
                alignSelf: 'center',
              }}
              onPress={() => _onSubmitHandler()}
              disabled={btnLoading}
              loading={btnLoading}>
              {I18n.t('sendBooking')}
            </Button>
          </View>
          <Divider />
          <Title style={{marginHorizontal: RFValue(15)}}>
            {I18n.t('gallery')}
          </Title>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              margin: RFValue(15),
            }}>
            {providerProfile.gallery.map((img, index) => (
              <>
                <Pressable
                  onPress={() => setImg(index)}
                  style={styles.imgDesign}>
                  <Image
                    source={{uri: PROVIDER_GALLERY + img.image_path}}
                    style={styles.img}
                  />
                </Pressable>
              </>
            ))}
            <Modal
              visible={img > -1}
              transparent={true}
              onRequestClose={() => setImg(undefined)}>
              <ImageViewer
                imageUrls={result}
                enableSwipeDown={true}
                onSwipeDown={() => setImg(undefined)}
                index={img}
              />
            </Modal>
          </View>
          <Divider />
          <ProviderRating />
          <Divider style={{marginTop: RFValue(10)}} />
          <Pressable
            style={styles.content2}
            onPress={() => navigation.navigate('ProviderReview')}>
            <Text style={styles.review}>{I18n.t('seeAllRev')}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </Pressable>
          <Divider style={{marginBottom: RFValue(25)}} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(10),
  },
  review: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  star: {
    flexDirection: 'row',
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('24%'),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  company_name: {
    textAlign: 'center',
    paddingVertical: RFValue(10),
    fontSize: RFValue(24),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  heading1: {
    paddingHorizontal: RFValue(10),
  },
  text1: {
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(10),
  },
  service_name: {
    fontSize: RFValue(15),
    paddingLeft: RFValue(10),
    paddingTop: RFValue(5),
  },
  heading2: {
    paddingHorizontal: RFValue(10),
    color: '#f54254',
  },
  line: {
    backgroundColor: '#f54254',
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(5),
  },
  price: {
    paddingVertical: RFValue(8),
  },
  content3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RFValue(10),
  },
  text2: {fontSize: RFValue(15)},
  text3: {
    color: Colors.primary,
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  description: {
    color: Colors.grey,
    fontSize: RFValue(13),
    paddingHorizontal: RFValue(10),
  },
  icon: {paddingTop: RFValue(5)},
  imgDesign: {
    width: Dimensions.get('screen').width / 3 - 20,
    height: RFValue(100),
    marginRight: RFValue(6),
    marginBottom: RFValue(6),
    borderWidth: RFValue(1),
    borderColor: '#808080',
  },
});

export default DetailScreen;
