import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View, StatusBar, FlatList} from 'react-native';
import {Card, Button, Searchbar} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import I18n from '../../languages/I18n';

const ServiceProvidersScreen = ({route, navigation}) => {
  const {bookingDate, bookingTime, qty, address_id, serviceId} = route.params;

  const {service_provider: serviceProviders} = useSelector(
    state => state.request,
  );

  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredList([...serviceProviders]);
  }, [serviceProviders]);

  const _onSearchHandler = searchText => {
    setFilteredList(
      serviceProviders.filter(
        item =>
          item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.service_price.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <Searchbar
        placeholder={I18n.t('search')}
        onChangeText={_onSearchHandler}
        value={search}
        style={styles.textInputStyle}
      />
      {filteredList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.activity}>{I18n.t('noService')}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredList}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View style={styles.rowStyle}>
                  <View style={{flexShrink: 1}}>
                    <Text style={styles.name}>{item.company_name}</Text>
                    <Text style={styles.exp}>
                      <Text style={{fontWeight: 'bold'}}>
                        {I18n.t('price')}:
                      </Text>{' '}
                      {I18n.t('aed')}{' '}
                      {parseFloat(item.service_price) * parseInt(qty)} for {qty}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.review}>{I18n.t('rev')}:</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingTop: RFValue(3.5),
                        }}>
                        <Ionicons
                          name="md-star"
                          size={RFValue(16)}
                          color={
                            item.rating >= 1 ? Colors.darkYellow : Colors.grey
                          }
                        />
                        <Ionicons
                          name="md-star"
                          size={RFValue(16)}
                          color={
                            item.rating >= 2 ? Colors.darkYellow : Colors.grey
                          }
                        />
                        <Ionicons
                          name="md-star"
                          size={RFValue(16)}
                          color={
                            item.rating >= 3 ? Colors.darkYellow : Colors.grey
                          }
                        />
                        <Ionicons
                          name="md-star"
                          size={RFValue(16)}
                          color={
                            item.rating >= 4 ? Colors.darkYellow : Colors.grey
                          }
                        />
                        <Ionicons
                          name="md-star"
                          size={RFValue(16)}
                          color={
                            item.rating >= 5 ? Colors.darkYellow : Colors.grey
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.btnStyles}>
                    <Button
                      mode="outlined"
                      onPress={() =>
                        navigation.navigate('Detail', {
                          selectedId: item.id,
                          partner_id: item.partner_id,
                          bookingDate,
                          bookingTime,
                          qty,
                          address_id,
                          serviceId,
                        })
                      }
                      style={{alignSelf: 'center'}}>
                      {I18n.t('selectProvider')}
                    </Button>
                  </View>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
    marginBottom: RFValue(15),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: RFValue(10),
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: RFValue(5),
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(15),
  },
  exp: {
    fontSize: RFValue(14),
    paddingTop: RFValue(8),
    marginBottom: RFValue(5),
  },
  review: {
    fontSize: RFValue(14),
    paddingTop: RFValue(3),
    paddingRight: RFValue(5),
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnStyles: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btn1: {
    alignSelf: 'center',
    width: '100%',
  },
});

export const screenOptions = () => ({
  headerTitle: I18n.t('serviceProviders'),
});

export default ServiceProvidersScreen;
