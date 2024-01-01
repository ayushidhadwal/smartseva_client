import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {Card} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../constants/Colors';

const ProviderReviewScreen = () => {
  const {providerReview} = useSelector(state => state.request);

  return (
    <View style={styles.screen}>
      {providerReview.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: RFValue(20),
            fontWeight: 'bold',
            marginVertical: RFValue(250),
          }}>
          No Reviews!
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={providerReview}
          keyExtractor={item => item.id + Math.random()}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

export default ProviderReviewScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: RFValue(8),
    padding: RFValue(10),
    marginHorizontal: RFValue(10),
  },
  name: {
    fontSize: RFValue(14),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  username: {
    fontStyle: 'italic',
    fontSize: RFValue(12),
    color: Colors.grey,
  },
  message: {
    marginTop: RFValue(10),
    fontSize: RFValue(12),
  },
});
