import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Image,
  StyleSheet,
  View,
  Alert,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
  I18nManager,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import RNPicker from 'rn-modal-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user';
import * as authActions from '../../store/actions/auth';
import {URL} from '../../constants/base_url';
import I18n from '../../languages/I18n';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';

const EditProfileScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState({
    id: '',
    name: '',
  });
  const [city, setCity] = useState({
    id: '',
    name: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [img, setImg] = useState(false);

  const dispatch = useDispatch();

  const {countries, cities} = useSelector(state => state.auth);
  const {Profile} = useSelector(state => state.user);

  useEffect(() => {
    setName(Profile.name);
    setCountry({
      id: Profile.country,
      name: Profile.country_name,
    });
    setCity({
      id: Profile.city,
      name: Profile.city_name,
    });
  }, [Profile]);

  const setCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setCountries);
    return () => unsubscribe;
  }, [navigation]);

  const setCities = useCallback(async () => {
    if (country.id) {
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setCities(country.id));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    }
  }, [country]);

  useEffect(() => {
    setCities();
  }, [setCities]);

  const _selectCountryHandler = useCallback(item => {
    setCountry({
      id: item.id,
      name: item.name,
    });
    setCity({
      id: '',
      name: '',
    });
  }, []);

  const _selectCityHandler = useCallback(item => {
    setCity({
      name: item.name,
      id: item.id,
    });
  }, []);


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
      await dispatch(userActions.updatePicture(profileImg));
    }
  };

  const images = [
    {
      url: image ? image : URL + Profile.photo,
    },
  ];

  const _zoomImageHandler = () => {
    setImg(true);
  };

  const _onSubmitHandler = useCallback(async () => {
    setSubmitLoading(true);
    setError(null);

    try {
      await dispatch(userActions.updateProfile(name, country.id, city.id));
      setError(I18n.t('alertProfileMsg'));
    } catch (e) {
      setError(e.message);
    }

    setSubmitLoading(false);
  }, [name, country, city]);

  useEffect(() => {
    if (error) {
      Alert.alert(I18n.t('alert'), error.toString(), [
        {text: I18n.t('okBtn'), onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      style={styles.screen}>
      <>
        <View
          style={{
            width: RFValue(150),
            height: RFValue(150),
            alignSelf: 'center',
          }}>
          {imgLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{
                width: RFValue(150),
                height: RFValue(150),
                alignSelf: 'center',
              }}
            />
          ) : (
            <>
              <Pressable
                onPress={_zoomImageHandler}
                style={styles.imageContainer}>
                <Image
                  source={image ? {uri: image} : {uri: URL + Profile.photo}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    backgroundColor: '#f7f7f7',
                  }}
                />
              </Pressable>
              {img && (
                <Modal
                  visible={true}
                  transparent={true}
                  onRequestClose={() => setImg(false)}>
                  <ImageViewer
                    imageUrls={images}
                    enableSwipeDown={true}
                    onSwipeDown={() => setImg(false)}
                  />
                </Modal>
              )}
            </>
          )}
          <MaterialIcons
            name="edit"
            size={24}
            color={Colors.white}
            style={{
              padding: RFValue(5),
              backgroundColor: Colors.primary,
              position: 'absolute',
              bottom: 3,
              right: 5,
              borderRadius: RFValue(100),
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}
            onPress={_openImagePicker}
          />
        </View>

        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('name')}
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
          left={<TextInput.Icon name="account" color={Colors.primary} />}
        />
        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('email')}
          style={styles.input}
          value={Profile.email}
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          editable={false}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: RFValue(10),
          }}>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('mob')}
            style={styles.input3}
            value={'+91-' + Profile.mobile}
            editable={false}
            left={<TextInput.Icon name="phone" color={Colors.primary} />}
          />
        </View>

        {/*<View style={styles.dropDownStyles}>*/}
        {/*  <Ionicons*/}
        {/*    name="earth"*/}
        {/*    size={24}*/}
        {/*    color={Colors.primary}*/}
        {/*    style={styles.earth}*/}
        {/*  />*/}
        {/*  <RNPicker*/}
        {/*    dataSource={countries}*/}
        {/*    defaultValue={country.name}*/}
        {/*    pickerTitle="Select Country"*/}
        {/*    showPickerTitle={true}*/}
        {/*    pickerStyle={styles.pickerStyle}*/}
        {/*    itemSeparatorStyle={styles.itemSeparatorStyle}*/}
        {/*    pickerItemTextStyle={styles.listTextViewStyle}*/}
        {/*    selectedLabel={country.name}*/}
        {/*    placeHolderLabel={I18n.t('country')}*/}
        {/*    selectLabelTextStyle={styles.selectLabelTextStyle}*/}
        {/*    placeHolderTextStyle={styles.placeHolderTextStyle}*/}
        {/*    selectedValue={(index, item) => _selectCountryHandler(item)}*/}
        {/*    dropDownImageStyle={styles.dropDownImageStyle}*/}
        {/*  />*/}
        {/*</View>*/}
        {/*<View style={styles.dropDownStyles}>*/}
        {/*  <Ionicons*/}
        {/*    name="location"*/}
        {/*    size={24}*/}
        {/*    color={Colors.primary}*/}
        {/*    style={styles.earth}*/}
        {/*  />*/}
        {/*  {cityLoading ? (*/}
        {/*    <ActivityIndicator*/}
        {/*      color={Colors.primary}*/}
        {/*      size="small"*/}
        {/*      style={{height: RFValue(55), marginLeft: RFValue(110)}}*/}
        {/*    />*/}
        {/*  ) : (*/}
        {/*    <RNPicker*/}
        {/*      dataSource={cities}*/}
        {/*      defaultValue={city.name}*/}
        {/*      pickerTitle="Select City"*/}
        {/*      showPickerTitle={true}*/}
        {/*      pickerStyle={styles.pickerStyle}*/}
        {/*      itemSeparatorStyle={styles.itemSeparatorStyle}*/}
        {/*      pickerItemTextStyle={styles.listTextViewStyle}*/}
        {/*      selectedLabel={city.name}*/}
        {/*      placeHolderLabel={I18n.t('city')}*/}
        {/*      selectLabelTextStyle={styles.selectLabelTextStyle}*/}
        {/*      placeHolderTextStyle={styles.placeHolderTextStyle}*/}
        {/*      selectedValue={(index, item) => _selectCityHandler(item)}*/}
        {/*      dropDownImageStyle={styles.dropDownImageStyle}*/}
        {/*      disablePicker={!country.id}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</View>*/}
        <Button
          mode="contained"
          style={styles.btn}
          onPress={_onSubmitHandler}
          loading={submitLoading}
          disabled={submitLoading}>
          {I18n.t('updProfileBtn')}
        </Button>
      </>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(15),
    backgroundColor: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
  },
  btn: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(45),
  },
  ///
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: RFValue(10),
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: Colors.grey,
    padding: RFValue(10),
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
    fontSize: RFValue(15),
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: RFValue(10),
    flex: 0.9,
    marginLeft: RFValue(20),
    marginHorizontal: RFValue(10),
    textAlign: 'left',
  },
  pickerStyle: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    width: '90%',
  },
  pickerStyleCode: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    width: '75%',
  },
  dropDownImageStyle: {
    width: RFValue(10),
    height: RFValue(10),
    alignSelf: 'center',
  },
  //
  dropDownStyles: {
    flexDirection: 'row',
    marginHorizontal: RFValue(10),
    borderBottomWidth: RFValue(1),
    borderBottomColor: '#d3d3d3',
  },
  earth: {
    paddingTop: RFValue(20),
    marginLeft: RFValue(12),
  },
  //
  input2: {
    backgroundColor: Colors.white,
    width: '28%',
  },
  input3: {
    backgroundColor: Colors.white,
    width: '100%',
  },
  zoomableView: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    borderRadius: 500,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});

export default EditProfileScreen;
