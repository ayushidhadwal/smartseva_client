import React from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAP_KEY} from '../../constants/googleMapKey';

const ChangeLocationScreen = ({navigation}) => {
  const autoCompleteOnPress = (data, details = null) => {
    let count = details.address_components.length;
    let all_address = '';

    const mapDetails = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      addresss: details.formatted_address,
      pincode: '',
      city: '',
      state: '',
    };

    for (let i = 0; i < count; i++) {
      if (details.address_components[i].types[0] === 'postal_code') {
        mapDetails.pincode = details.address_components[i].short_name;
      } else if (
        details.address_components[i].types[0] === 'administrative_area_level_2'
      ) {
        mapDetails.city = details.address_components[i].long_name;
      } else if (
        details.address_components[i].types[0] === 'administrative_area_level_1'
      ) {
        mapDetails.state = details.address_components[i].long_name;
      } else if (details.address_components[i].types[0] === 'country') {
        mapDetails.country = details.address_components[i].long_name;
      } else {
        all_address += details.address_components[i].long_name;
        all_address += ', ';
      }
    }

    navigation.navigate('Map', mapDetails);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#f5b942'} />
      <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          keyboardAppearance={'light'}
          listViewDisplayed="auto"
          fetchDetails={true}
          renderDescription={row => row.description}
          onPress={autoCompleteOnPress}
          getDefaultValue={() => ''}
          query={{
            key: `${GOOGLE_MAP_KEY}`,
            language: 'en',
          }}
          styles={styles.mapMarker}
          currentLocation={true}
          currentLocationLabel="Current location"
          debounce={200}
        />
      </View>

      {/*</KeyboardAwareScrollView>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    height: 450,
    width: 400,

    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  location: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  btn: {
    width: '95%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  mapMarker: {
    textInputContainer: {
      width: '100%',
    },
    description: {
      fontWeight: 'bold',
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
});
export default ChangeLocationScreen;
