import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';

export const Loader = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
