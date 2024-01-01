import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Platform, Text, Alert} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as requestAction from '../../store/actions/request';
import Colors from '../../constants/Colors';
import I18n from '../../languages/I18n';
import {Picker} from '@react-native-picker/picker';

const HelpScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState('');

  const dispatch = useDispatch();
  const {complaintList} = useSelector(state => state.request);

  const getComplaintTypes = useCallback(async () => {
    try {
      await dispatch(requestAction.getComplaintTypes());
    } catch (e) {
      setError(e.message);
    }
  }, [dispatch]);

  useEffect(() => {
    getComplaintTypes();
  }, [getComplaintTypes]);

  const _insertUrgentService = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.urgentServices(complaint, image, comment));
      setImage(null);
      setComment('');
      Alert.alert('Alert', 'Request sent successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [comment, complaint, dispatch, image, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <>
          <Title style={styles.heading}>{I18n.t('submitQuery')}</Title>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Complaint Type</Text>
          <View style={styles.pickerStyle}>
            <Picker
              selectedValue={complaint}
              onValueChange={(itemValue, itemIndex) => setComplaint(itemValue)}>
              {complaintList.length > 0
                ? complaintList.map((complaints, index) => (
                    <Picker.Item
                      key={index}
                      label={complaints.Complaints}
                      value={complaints.Complaints}
                    />
                  ))
                : []}
            </Picker>
          </View>
          <TextInput
            mode="outlined"
            label={I18n.t('desc')}
            style={styles.input}
            multiline
            numberOfLines={10}
            value={comment}
            onChangeText={setComment}
          />

          {image !== null && (
            <View style={styles.content}>
              <Text style={styles.text}>Uploaded Successfully</Text>
              <Ionicons
                style={{paddingBottom: RFValue(5)}}
                name="checkmark-done"
                size={24}
                color={Colors.primary}
              />
            </View>
          )}
          <Button
            mode="contained"
            style={styles.submit}
            loading={loading}
            disabled={loading}
            onPress={_insertUrgentService}>
            {I18n.t('submitBtn')}
          </Button>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  heading: {
    marginBottom: RFValue(15),
    fontWeight: 'bold',
  },
  Btn: {
    alignSelf: 'center',
    marginVertical: RFValue(15),
    borderRadius: RFValue(100),
    width: '60%',
  },
  submit: {
    width: '90%',
    borderRadius: RFValue(10),
    alignSelf: 'center',
    marginVertical: RFValue(15),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: RFValue(20),
    color: Colors.primary,
  },
  pickerStyle: {
    borderWidth: 2,
    borderColor: '#cccccc',
    marginVertical: 10,
  },
});

export default HelpScreen;
