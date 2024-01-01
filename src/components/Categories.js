import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, Image, Pressable, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Title} from 'react-native-paper';

import Colors from '../constants/Colors';
import {IMG_URL} from '../constants/base_url';
import I18n from '../languages/I18n';

const Categories = ({onCategoryPress}) => {
  const {services} = useSelector(state => state.home);

  return (
    <>
      <Title
        style={{
          paddingTop: RFValue(6),
          color: Colors.primary,
          textAlign: 'center',
        }}>
        {I18n.t('bookService')}
      </Title>
      <View style={styles.gridView}>
        {services.map(item => {
          return (
            <Pressable
              key={item.id}
              style={styles.itemContainer}
              onPress={() => onCategoryPress(item.id, item.service_name)}>
              <Image
                source={{
                  uri: IMG_URL + item.service_icon,
                }}
                style={styles.icons}
              />
              <Text numberOfLines={2} style={styles.iconName}>
                {item.service_name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    marginVertical: 15,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '25%',
    height: 100,
    margin: RFValue(12),
    padding: RFValue(4),
    backgroundColor: 'white',
  },
  icons: {
    width: RFValue(35),
    height: RFValue(35),
    alignSelf: 'center',
  },
  iconName: {
    textAlign: 'center',
    paddingTop: RFValue(5),
    fontSize: RFValue(12),
  },
});

export default Categories;
