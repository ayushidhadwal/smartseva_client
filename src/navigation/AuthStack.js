import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from '../screen/auth/LoginScreen';
import OTPScreen from '../screen/auth/OTPScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';
import ForgotPassScreen from '../screen/auth/ForgotPassScreen';
import ResetPassScreen from '../screen/auth/ResetPassScreen';
import VerifyEmailScreen from '../screen/auth/VerifyEmailScreen';

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{
          title: 'OTP Verification',
          headerLeft: null,
        }}
      />
      
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Account Verification',
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="Forgot"
        component={ForgotPassScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPass"
        component={ResetPassScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
