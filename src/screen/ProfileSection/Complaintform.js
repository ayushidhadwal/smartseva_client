import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, Alert, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../languages/I18n';

const Complaintform = props => {
  const {navigation} = props;
  const {booking_id, partner_id} = props.route.params;

  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.raise_complaint(partner_id, booking_id, subject, comment),
      );
      setSubject('');
      setComment('');
      Alert.alert('Alert', 'Complaint Registered Successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [dispatch, partner_id, booking_id, subject, comment, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView style={{padding: 20}}>
        <TextInput
          mode="outlined"
          label={I18n.t('subj')}
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          mode="outlined"
          label={I18n.t('complaint')}
          style={styles.input1}
          multiline
          numberOfLines={10}
          value={comment}
          onChangeText={setComment}
        />
        <Button
          mode="contained"
          style={styles.btn}
          onPress={onSubmitHandler}
          loading={loading}
          disabled={loading}>
          {I18n.t('submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  input: {
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  input1: {
    marginBottom: RFValue(30),
    backgroundColor: Colors.white,
  },
  btn: {
    borderRadius: RFValue(20),
    width: '60%',
    alignSelf: 'center',
    marginBottom: RFValue(30),
  },
});
export default Complaintform;
