import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {GOOGLE_MAP_KEY} from '../constants/googleMapKey';

export const useReverseGeocoding = (lat, long) => {
  const [address, setAddress] = useState('');
  const [states, setStates] = useState('');

  const getLocationbyCoodinates = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_MAP_KEY}`,
      );
      if (response.data.results.length > 0) {
        const add = response.data.results[0].formatted_address;
        let value = add.split(',');
        let count = value.length;

        setAddress(response.data.results[0].formatted_address);
        setStates(response.data.results[9].formatted_address);

        // let country = value[count - 1];
        // let state = value[count - 2];
        // let city = value[count - 3];
      }
    } catch (e) {
      console.log('ERR: ', e);
    }
  }, [lat, long]);

  useEffect(() => {
    getLocationbyCoodinates();
  }, [getLocationbyCoodinates]);

  return [address, states];
};
