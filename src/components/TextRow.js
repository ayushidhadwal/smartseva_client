import React from 'react';
import {Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

export const TextRow = ({heading, desc, style}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: RFValue(10),
        marginBottom: RFValue(5),
      }}>
      <Text style={{flex: 0.5, fontWeight: 'bold'}}>{heading}: </Text>
      <Text style={[{flex: 1, textAlign: 'right'}, style]}>{desc}</Text>
    </View>
  );
};
