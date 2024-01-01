import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Text, View, Image, BackHandler} from 'react-native';
import {Button, Headline} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const LocationScreen = props => {
  const {rUser_id} = useSelector(state => state.auth);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [lat, setLat] = useState(0);
  const [lang, setLang] = useState(0);

  const dispatch = useDispatch();

  const onClickHandler = useCallback(async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    // setLocation(location);
    setLang(location.coords.longitude);
    setLat(location.coords.latitude);
    local();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, [rUser_id]);

  const local = useCallback(async () => {
    await dispatch(authActions.location(rUser_id));
    await dispatch(authActions.setLocation(lat, lang));
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Hi, nice to meet you!</Text>
      <Headline style={styles.heading}>See service around</Headline>
      <Image
        style={styles.img}
        source={{
          uri: 'https://image.freepik.com/free-vector/big-modern-city-skyscraper-panoramic-view_48369-21849.jpg',
        }}
      />
      <Button
        mode="contained"
        contentStyle={{height: 50}}
        style={styles.btn}
        onPress={onClickHandler}>
        Your current location
      </Button>
      <Button
        mode="outlined"
        style={styles.btn}
        contentStyle={{height: 50}}
        onPress={local}>
        Skip
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  text: {
    textAlign: 'center',
    marginTop: RFValue(100),
    marginBottom: RFValue(15),
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFValue(22),
  },
  img: {
    width: wp('100%'),
    alignSelf: 'center',
    height: hp('30%'),
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: RFValue(25),
  },
});

export default LocationScreen;
