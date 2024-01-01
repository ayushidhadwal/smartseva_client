import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
// import {useLastNotificationResponse} from 'expo-notifications';
// import * as Notifications from 'expo-notifications';
// import {useEffect} from 'react';
// import {CommonActions} from '@react-navigation/native';

import Colors from '../constants/Colors';
import HomeScreen from '../screen/BottomTabs/HomeScreen';
import RewardScreen from '../screen/BottomTabs/RewardScreen';
import ProfileScreen from '../screen/BottomTabs/ProfileScreen';
import ServiceReqScreen from '../screen/BottomTabs/ServiceReqScreen';
import I18n from '../languages/I18n';
// import {RFValue} from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PendingReqScreen from '../screen/BottomTabs/PendingReqScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = ({navigation}) => {
  
  // const response = useLastNotificationResponse();

  // useEffect(() => {
  //   if (
  //     response &&
  //     response.notification.request.content.data.screen &&
  //     response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     const {screen, params} = response.notification.request.content.data;
  //     navigation.dispatch(
  //       CommonActions.navigate({
  //         name: screen,
  //         params: params,
  //       }),
  //     );
  //   }
  // }, [response]);

  return (
    <Tab.Navigator
      shifting={false}
      backBehavior={'initialRoute'}
      screenOptions={{
        tabBarStyle: {backgroundColor: Colors.primary},
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: I18n.t('homeBottomTab'),
          tabBarIcon: tabInfo => (
            <Entypo
              name="home"
              size={20}
              color={tabInfo.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ServiceReq"
        component={ServiceReqScreen}
        options={{
          tabBarLabel: 'Service',
          // tabBarLabel: I18n.t('serviceBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons
              name="list"
              size={20}
              color={tabInfo.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PendingRequest"
        component={PendingReqScreen}
        options={{
          //tabBarLabel: I18n.t('profileBottomTab'),
          tabBarLabel: 'Pending',
          tabBarIcon: tabInfo => (
            <MaterialIcons
              name={Platform.OS === 'ios' ? 'ios-person-circle' : 'pending'}
              size={20}
              color={tabInfo.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reward"
        component={RewardScreen}
        options={{
          // tabBarLabelStyle: {fontSize: 8},
          tabBarLabel: I18n.t('rewardBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons
              name="wallet"
              size={20}
              color={tabInfo.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: tabInfo => (
            <Ionicons
              name="settings"
              size={20}
              color={tabInfo.color}
            />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default BottomTabs;