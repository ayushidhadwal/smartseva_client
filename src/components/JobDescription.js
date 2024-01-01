import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Modal, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Divider} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';

import * as requestAction from '../store/actions/request';
import {TextRow} from './TextRow';
import {URL} from '../constants/base_url';
import I18n from '../languages/I18n';
import moment from 'moment';

const JobDescription = ({
  status,
  payment_status,
  bookingId,
  navigation,
  confirmStatus,
  confirmUserStatus,
  confirmUserImages,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [img, setImg] = useState();
  const [partnerImg, setPartnerImg] = useState();

  const {pictures} = useSelector(state => state.request);

  const dispatch = useDispatch();

  const completedServicePicture = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.getCompleteServicePictures(bookingId));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (status === 'COMPLETED' && payment_status === 'SUCCESS') {
      completedServicePicture();
    }
  }, [completedServicePicture, payment_status, status]);

  const userImage = confirmUserImages.map(i => ({
    url: URL + i.sc_images,
  }));

  const partnerImages = pictures.images.map(n => ({
    url: n,
  }));

  return (
    <View>
      {status === 'COMPLETED' && payment_status === 'SUCCESS' ? (
        <View style={[styles.card, {marginBottom: RFValue(10)}]}>
          <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
            {I18n.t('jobCompDesc')}
          </Text>
          <Divider style={styles.marginVertical} />
          <TextRow heading={I18n.t('date')} desc={pictures.date} />
          <TextRow heading={I18n.t('time')} desc={pictures.time} />
          <Divider style={{marginBottom: RFValue(5)}} />
          <TextRow heading={I18n.t('desc')} desc={pictures.description} />
          <Divider />
          <View style={styles.gallery}>
            {pictures.images.map((i, index) => (
              <Pressable
                key={index}
                style={styles.imgDesign}
                onPress={() => setPartnerImg(index)}>
                <Image source={{uri: i}} style={styles.imgStyles} />
              </Pressable>
            ))}
          </View>
          <Modal
            visible={partnerImg > -1}
            transparent={true}
            onRequestClose={() => setPartnerImg(undefined)}>
            <ImageViewer
              imageUrls={partnerImages}
              enableSwipeDown={true}
              onSwipeDown={() => setPartnerImg(undefined)}
              index={partnerImg}
            />
          </Modal>
          <Divider />
          <View style={{marginVertical: RFValue(20)}}>
            {confirmUserStatus && (
              <TextRow
                heading={I18n.t('yourComment')}
                desc={confirmUserStatus}
              />
            )}
            {confirmUserImages.length > 0 && (
              <>
                <Text
                  style={{
                    paddingLeft: RFValue(10),
                    fontWeight: 'bold',
                  }}>
                  {I18n.t('yourImg')}:
                </Text>
                <View style={styles.gallery}>
                  {confirmUserImages.map((i, index) => (
                    <Pressable
                      key={index}
                      style={styles.imgDesign}
                      onPress={() => setImg(index)}>
                      <Image
                        source={{uri: URL + i.sc_images}}
                        style={styles.imgStyles}
                      />
                    </Pressable>
                  ))}
                </View>
                <Modal
                  visible={img > -1}
                  transparent={true}
                  onRequestClose={() => setImg(undefined)}>
                  <ImageViewer
                    imageUrls={userImage}
                    enableSwipeDown={true}
                    onSwipeDown={() => setImg(undefined)}
                    index={img}
                  />
                </Modal>
              </>
            )}
          </View>
          {/*<Button*/}
          {/*  mode="contained"*/}
          {/*  uppercase={false}*/}
          {/*  style={{*/}
          {/*    width: '70%',*/}
          {/*    alignSelf: 'center',*/}
          {/*    borderRadius: RFValue(100),*/}
          {/*  }}*/}
          {/*  onPress={() =>*/}
          {/*    navigation.navigate('serviceConfirmation', {*/}
          {/*      booking_id: bookingId,*/}
          {/*    })*/}
          {/*  }*/}
          {/*  disabled={confirmStatus !== 'PENDING'}>*/}
          {/*  {I18n.t('serviceConf')}*/}
          {/*</Button>*/}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: RFValue(10),
  },
  imgDesign: {
    width: RFValue(90),
    height: RFValue(90),
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
    borderWidth: 1 / 2,
    borderColor: '#cacbcc',
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default JobDescription;
