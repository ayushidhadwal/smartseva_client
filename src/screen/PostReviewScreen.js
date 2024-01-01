import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, Text, View, Image, Alert, Platform} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as requestAction from '../store/actions/request';
import Colors from '../constants/Colors';
import I18n from '../languages/I18n';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';

const stars = [1, 2, 3, 4, 5];

const PostReviewScreen = props => {
  const partner_id = props.route.params.provider;
  const booking_id = props.route.params.booking_id;

  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [service, setService] = useState(0);
  const [money, setMoney] = useState(0);
  const [behaviour, setBehaviour] = useState(0);


  const _openImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    let profileImg = {
      name: '',
      uri: '',
      type: '',
    };

    if ('assets' in result) {
      result.assets.forEach(asset => {
        profileImg = {
          name: asset.fileName,
          uri: asset.uri,
          type: asset.type,
        };

        setImage(profileImg.uri);
      });
    }
  };

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.post_review(
          message,
          image,
          service.toString(),
          money.toString(),
          behaviour.toString(),
          partner_id,
          booking_id,
        ),
      );

      setLoading(false);
      Alert.alert(I18n.t('alert'), I18n.t('alertRevSubmit'), [
        {
          text: 'OK',
          onPress: () => props.navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [message, image, service, money, behaviour, partner_id, booking_id]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.text5}>{I18n.t('msg')}</Text>
      <TextInput
        mode="outlined"
        placeholder={I18n.t('typeHere')}
        numberOfLines={8}
        multiline
        style={styles.input1}
        value={message}
        onChangeText={setMessage}
      />
      <View style={styles.row1}>
        <Text style={styles.text2}>{I18n.t('rateService')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={service >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setService(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <View style={styles.row1}>
        <Text style={styles.text2}>{I18n.t('valForMoney')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={money >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setMoney(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <View style={styles.row1}>
        <Text style={styles.text2}>{I18n.t('behavRate')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={behaviour >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setBehaviour(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <Button
        mode="outlined"
        onPress={_openImagePicker}
        icon="attachment"
        uppercase={false}
        style={{
          width: '60%',
          marginVertical: RFValue(10),
          borderRadius: RFValue(50),
          alignSelf: 'center',
        }}>
        {I18n.t('attachBtn')}
      </Button>
      {image && (
        <View style={styles.imgContainer}>
          <Image source={{uri: image}} style={styles.img} />
        </View>
      )}
      <View style={styles.row2}>
        {image && (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text4}>{'uploaded successfully'}</Text>
            <Ionicons name="checkmark-done" size={24} color={Colors.primary} />
          </View>
        )}
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{height: 50}}
        onPress={onSubmitHandler}
        loading={loading}
        disabled={loading}>
        {I18n.t('submitBtn')}
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  input1: {
    marginBottom: RFValue(15),
    backgroundColor: Colors.white,
    marginHorizontal: RFValue(10),
  },
  row1: {
    flexDirection: 'row',
    marginBottom: RFValue(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(10),
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input2: {
    backgroundColor: Colors.white,
    width: '40%',
  },
  text2: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: Colors.black,
  },
  text4: {
    fontSize: RFValue(15),
    marginRight: RFValue(5),
    color: Colors.primary,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  btn: {
    marginVertical: RFValue(15),
    width: '40%',
    alignSelf: 'center',
    borderRadius: RFValue(50),
    marginBottom: RFValue(30),
  },
  imgContainer: {
    width: wp('60%'),
    height: hp('22%'),
    margin: RFValue(5),
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heading: {
    marginVertical: RFValue(20),
    fontWeight: 'bold',
    marginLeft: RFValue(10),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  text5: {
    paddingLeft: RFValue(10),
    color: Colors.black,
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
});

export default PostReviewScreen;
