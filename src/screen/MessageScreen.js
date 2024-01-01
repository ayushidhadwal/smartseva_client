import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
  I18nManager,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {moderateScale} from 'react-native-size-matters';
import {Caption} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../store/actions/user';
import dayjs from 'dayjs';

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const keyboardHide = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  return [keyboardHeight];
};

const MessageScreen = ({route, navigation}) => {
  const [text, setText] = React.useState('');
  const {bookingId, partnerId} = route.params;

  const {getChats} = useSelector(state => state.user);

  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const [keyboardHeight] = useKeyboard();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getPreviousMessage);

    return () => unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      getPreviousMessage();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getPreviousMessage = async () => {
    setError(null);
    try {
      await dispatch(userActions.getMessage(bookingId, partnerId));
    } catch (e) {
      setError(e.message);
    }
  };

  const _onSubmitHandler = useCallback(async () => {
    setChatLoading(true);
    setError(null);
    try {
      await dispatch(userActions.sendMessage(bookingId, text));
      setText('');
    } catch (e) {
      setError(e.message);
    }
    setChatLoading(false);
  }, [bookingId, text]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  let flatList = React.useRef();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors.white,
      }}>
      <FlatList
        ref={ref => (flatList = ref)}
        onContentSizeChange={() => flatList.scrollToEnd({animated: false})}
        onLayout={() => flatList.scrollToEnd({animated: false})}
        keyExtractor={item => item.bookingId}
        data={getChats}
        renderItem={itemData => {
          return 'user' === itemData.item.type ? (
            <View style={[styles.item, styles.itemOut]}>
              <View style={[styles.balloon, {backgroundColor: Colors.primary}]}>
                <Text style={{paddingTop: 5, color: 'white'}}>
                  {itemData.item.message}
                </Text>
                <Caption style={{color: '#fff'}}>
                  {dayjs(itemData.item.created_at).format('hh:mm a')}
                </Caption>
                <View
                  style={[styles.arrowContainer, styles.arrowRightContainer]}>
                  <Svg
                    style={styles.arrowRight}
                    width={moderateScale(15.5, 0.6)}
                    height={moderateScale(17.5, 0.6)}
                    viewBox="32.485 17.5 15.515 17.5"
                    enable-background="new 32.485 17.5 15.515 17.5">
                    <Path
                      d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                      fill={Colors.primary}
                      x="0"
                      y="0"
                    />
                  </Svg>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.item, styles.itemIn]}>
              <View style={[styles.balloon, {backgroundColor: '#f0f0f2'}]}>
                <Text style={{paddingTop: 5, color: 'black'}}>
                  {itemData.item.message}
                </Text>
                <Caption style={{color: 'black'}}>
                  {dayjs(itemData.item.created_at).format('hh:mm a')}
                </Caption>
                <View
                  style={[styles.arrowContainer, styles.arrowLeftContainer]}>
                  <Svg
                    style={styles.arrowLeft}
                    width={moderateScale(15.5, 0.6)}
                    height={moderateScale(17.5, 0.6)}
                    viewBox="32.484 17.5 15.515 17.5"
                    enable-background="new 32.485 17.5 15.515 17.5">
                    <Path
                      d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                      fill="#f0f0f2"
                      x="0"
                      y="0"
                    />
                  </Svg>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          },
          {
            marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
          },
        ]}>
        <TextInput
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          value={text}
          onChangeText={text => setText(text)}
          placeholder={'Write your massage here...'}
          style={styles.inputStyle}
          multiline
        />
        <Pressable
          onPress={_onSubmitHandler}
          disable={text === '' || chatLoading}>
          {chatLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="md-send" size={35} color={Colors.primary} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export const screenOptions = ({route}) => ({
  headerTitle: route.params.companyName,
});

const styles = StyleSheet.create({
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-5.7, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6.2, 0.5),
  },

  inputStyle: {
    backgroundColor: '#f0f0f2',
    width: '85%',
    borderRadius: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: '#c0c0c2',
  },
});

export default MessageScreen;
