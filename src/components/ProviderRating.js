import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '../languages/I18n';
import Colors from '../constants/Colors';

const ProviderRating = () => {
  const {providerProfile} = useSelector(state => state.request);
  return (
    <View style={{paddingHorizontal: RFValue(10)}}>
      <View style={styles.star}>
        <Title style={styles.heading}>{I18n.t('overallRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.total_rating !== 0 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={providerProfile.total_rating >= 2 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={providerProfile.total_rating >= 3 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={providerProfile.total_rating >= 4 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={providerProfile.total_rating >= 5 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{I18n.t('serviceRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.service_rating !== 0 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.service_rating >= 2 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.service_rating >= 3 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.service_rating >= 4 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.service_rating >= 5 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{I18n.t('valForMoneyRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.value_for_money_rating !== 0
              ? Colors.darkYellow
              : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.value_for_money_rating >= 2
              ? Colors.darkYellow
              : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.value_for_money_rating >= 3
              ? Colors.darkYellow
              : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.value_for_money_rating >= 4
              ? Colors.darkYellow
              : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.value_for_money_rating >= 5
              ? Colors.darkYellow
              : 'grey'
          }
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{I18n.t('behavRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.behaviour_rating !== 0 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.behaviour_rating >= 2 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.behaviour_rating >= 3 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.behaviour_rating >= 4 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={
            providerProfile.behaviour_rating >= 5 ? Colors.darkYellow : 'grey'
          }
          style={styles.icon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: RFValue(14),
  },
  icon: {
    paddingTop: RFValue(5),
  },
});

export default ProviderRating;
