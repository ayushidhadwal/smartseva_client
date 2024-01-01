import React from 'react';
import {StyleSheet, Text, Image, ScrollView} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';

const SERV_GO_IMG = require('../../../assets/icon.png');

const AboutUs = () => {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text>
        SMARTSEVA is a platform that connects customers with service providers.
        And acts as such by creating, hosting, maintaining and providing our
        SMARTSEVA services to you via the internet through website and mobile
        applications. Our services allow you to request any service from any
        service provider with a SMARTSEVA account, and, where available, to
        receive rewards. Our service availability varies by country or region.
        You can see what services are available in your country/region by
        logging into your SMARTSEVA account.
      </Text>
      <Text>SMARTSEVA services are offered by SMARTSEVA FZ-LLC.</Text>
      <Image source={SERV_GO_IMG} style={styles.logo} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(15),
  },
  logo: {
    width: RFValue(100),
    height: RFValue(50),
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  version: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AboutUs;
