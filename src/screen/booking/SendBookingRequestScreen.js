import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
  Easing,
} from 'react-native';
import {Button, Divider, Subheading, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useSelector} from 'react-redux';

import {useKeyboard} from '../../hooks/useKeyboard';
import Colors from '../../constants/Colors';
import {TextRow} from '../../components/TextRow';

const SendBookingRequestScreen = () => {
  const [checked, setChecked] = useState('1');
  const [instructions, setInstructions] = useState('');
  const {addresses} = useSelector(state => state.address);

  const keyboardHeight = useKeyboard();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: keyboardHeight,
      duration: 10,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animatedHeight, keyboardHeight]);

  return (
    <View style={styles.screen}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.orderSummaryContainer}>
          <Subheading style={styles.summaryHeading}>
            Your Order Summary
          </Subheading>
          <Divider style={styles.marginVertical} />
          <TextRow heading="Service" desc="AC Service & Repair" />
          <TextRow heading="Sub-Service" desc="AC servicing" />
          <TextRow heading="Date" desc="21/09/2021" />
          <TextRow heading="Time" desc="13:00" />
          <TextRow heading="Quantity" desc="2" />
          <TextRow heading="Provider" desc="WORLD of SAS" />
          <TextRow heading="Payment Due" desc="₹ 2000" />
        </View>

        {/*<View>*/}
        {/*  <Subheading*/}
        {/*    style={[styles.summaryHeading, { marginTop: RFValue(12) }]}*/}
        {/*  >*/}
        {/*    Please Select/Add Address*/}
        {/*  </Subheading>*/}
        {/*  <RadioButton.Group*/}
        {/*    onValueChange={(value) => setChecked(value)}*/}
        {/*    value={checked}*/}
        {/*  >*/}
        {/*    {addresses.map((address) => (*/}
        {/*      <Pressable*/}
        {/*        onPress={() => setChecked(address.id)}*/}
        {/*        key={address.id}*/}
        {/*        style={styles.radioButtonContainer}*/}
        {/*      >*/}
        {/*        <RadioButton.Android*/}
        {/*          value={address.id}*/}
        {/*          color={Colors.primary}*/}
        {/*        />*/}
        {/*        <Text style={styles.radioHeading}>*/}
        {/*          {address.name}, {address.address}, {address.city},{" "}*/}
        {/*          {address.country}*/}
        {/*        </Text>*/}
        {/*      </Pressable>*/}
        {/*    ))}*/}
        {/*  </RadioButton.Group>*/}

        {/*  <Pressable*/}
        {/*    onPress={() => alert("Redirect to Address screen")}*/}
        {/*    style={[*/}
        {/*      styles.radioButtonContainer,*/}
        {/*      {*/}
        {/*        alignItems: "center",*/}
        {/*        marginBottom: RFValue(12),*/}
        {/*        borderWidth: 2,*/}
        {/*        borderColor: "#dedede",*/}
        {/*        borderStyle: "dashed",*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  >*/}
        {/*    <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>*/}
        {/*      Add New Address*/}
        {/*    </Text>*/}
        {/*  </Pressable>*/}
        {/*</View>*/}
      </ScrollView>
      <Animated.View
        style={[
          styles.formView,
          {marginBottom: Platform.OS === 'ios' ? animatedHeight : 0},
        ]}>
        <Subheading>Instructions if Any (Optional)</Subheading>
        <TextInput
          label="Write your instructions here (Optional)"
          mode="outlined"
          multiline={true}
          style={styles.inputBox}
          value={instructions}
          onChangeText={setInstructions}
        />
        <Button mode="contained">Send Booking Request</Button>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  addressView: {
    flex: 1,
  },
  inputBox: {
    marginBottom: RFValue(10),
    maxHeight: RFValue(100),
  },
  formView: {
    borderTopWidth: RFValue(1),
    borderColor: '#dedede',
    padding: RFValue(12),
    backgroundColor: 'white',
    width: '100%',
  },
  orderSummaryContainer: {
    backgroundColor: 'white',
    padding: RFValue(12),
  },
  summaryHeading: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  marginVertical: {
    marginVertical: RFValue(10),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: RFValue(12),
    marginTop: RFValue(12),
    padding: RFValue(10),
  },
  radioHeading: {
    fontWeight: 'bold',
    width: '80%',
  },
});

export const screenOptions = () => ({
  headerTitle: 'Send Booking Request',
});

export default SendBookingRequestScreen;
