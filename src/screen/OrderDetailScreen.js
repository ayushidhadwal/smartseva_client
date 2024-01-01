import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Card, Title} from 'react-native-paper';
// import {FontAwesome} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../constants/Colors';

const OrderDetailScreen = props => {
  return (
    <View style={styles.screen}>
      <Card style={styles.cardContainer}>
        <View style={styles.rowContainer}>
          {/*<FontAwesome*/}
          {/*  name="user"*/}
          {/*  size={40}*/}
          {/*  color="black"*/}
          {/*  style={styles.user}*/}
          {/*/>*/}
          <View style={styles.rowContainer2}>
            <Title style={styles.book}>Booking Accepted</Title>
            <Text>
              We will end the details of your service provider 1 hour before
              scheduled time.
            </Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          {/*<FontAwesome name="calendar" size={40} color="black" />*/}
          <Title style={styles.calender}>12:00 PM on 22nd July 2021</Title>
        </View>
        <View style={styles.rowContainer1}>
          <Button
            mode="outlined"
            icon="eye"
            style={styles.btn}
            onPress={() => props.navigation.navigate('ViewOrders')}>
            View
          </Button>
          <Button mode="outlined" icon="phone" style={styles.btn}>
            Call
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(20),
  },
  cardContainer: {
    padding: RFValue(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(15),
  },
  rowContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: RFValue(15),
  },
  user: {
    marginTop: RFValue(15),
  },
  rowContainer2: {
    flex: 3 / 4,
  },
  book: {
    fontWeight: 'bold',
  },
  calender: {
    fontWeight: 'bold',
    flex: 3 / 4,
  },
  btn: {borderRadius: RFValue(50)},
});

export default OrderDetailScreen;
