import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

import RootStack from './RootStack';
import AuthStack from './AuthStack';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import {SESSION_ID} from '../store/actions/auth';
import { registerNotification } from '../lib/Notifee';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {user_id} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const id = await AsyncStorage.getItem(SESSION_ID);

      if (id) {
        dispatch(authActions.auth(id));
      }

      setIsLoading(false);
      SplashScreen.hide();
      registerNotification()
    })();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user_id ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
