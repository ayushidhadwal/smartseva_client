import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../constants/Colors';
import OTPForm from '../../components/OTPForm';

const OTPScreen = props => {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <OTPForm {...props} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
