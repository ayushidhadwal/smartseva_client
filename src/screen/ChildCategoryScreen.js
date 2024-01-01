import React from 'react';
import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import {Button, Divider, Headline} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import ChildCategory from '../data/ChildCategory';

const ChildCategoryScreen = props => {
  const [show, setShow] = React.useState(false);
  return (
    <View style={styles.screen}>
      <Headline style={styles.title}>Switch and Socket</Headline>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={ChildCategory}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <View style={styles.listSection}>
              <View style={styles.list}>
                <Text style={styles.subHeading}>{item.serviceName}</Text>
                <Text style={styles.subHeading}>{item.qty}</Text>
                <Text>{item.rating}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Divider />
                <Text style={styles.cost}>{item.desc}</Text>
                <Button
                  mode="contained"
                  style={styles.btn}
                  onPress={() => {
                    setShow(!show);
                  }}>
                  Add
                </Button>
              </View>
              <View style={styles.imgContainer}>
                <Image
                  source={{
                    uri: item.serviceImg,
                  }}
                  style={styles.img}
                />
              </View>
            </View>
          );
        }}
      />
      {show === true ? (
        <View style={styles.bottombtn}>
          <Text style={styles.totalAmt}>₹ 500</Text>
          <Button
            mode="text"
            labelStyle={{color: Colors.white}}
            onPress={() => props.navigation.navigate('Cart')}>
            Summary
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    paddingHorizontal: RFValue(15),
    paddingTop: RFValue(15),
    fontWeight: 'bold',
  },
  listSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: RFValue(15),
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
  list: {
    padding: RFValue(5),
  },
  price: {
    paddingVertical: RFValue(8),
    fontWeight: 'bold',
  },
  cost: {
    paddingVertical: RFValue(8),
  },
  imgContainer: {
    width: wp('25%'),
    height: hp('15%'),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  btn: {
    width: '25%',
  },
  bottombtn: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(8),
    margin: RFValue(8),
  },
  totalAmt: {
    fontSize: RFValue(14),
    paddingTop: RFValue(7),
    color: Colors.white,
    paddingLeft: RFValue(20),
  },
});

export default ChildCategoryScreen;
