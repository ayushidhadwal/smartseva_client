/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging';
import { onMessageReceived } from './src/lib/Notifee';

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async () => {});
notifee.onForegroundEvent(async () => {});


AppRegistry.registerComponent(appName, () => App);
