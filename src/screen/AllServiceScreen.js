import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Card, Searchbar} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../constants/Colors';
import * as homeActions from '../store/actions/home';
import {IMG_URL} from '../constants/base_url';
import I18n from '../languages/I18n';

const SearchItem = ({onPress, image, title}) => (
  <Card onPress={onPress} style={styles.cardContainer}>
    <View style={{flexDirection: 'row'}}>
      <View style={styles.imgContainer}>
        <Image source={{uri: IMG_URL + image}} style={styles.img} />
      </View>
      <Text style={styles.itemStyle}>{title}</Text>
    </View>
  </Card>
);

const AllServiceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {searchData} = useSelector(state => state.home);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFilteredDataSource([...searchData]);
  }, [searchData]);

  const onSearchHandler = searchText => {
    setFilteredDataSource(
      searchData.filter(item =>
        item.subcategory_name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  const setSearchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(homeActions.getSearch(search));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setSearchData);
    return () => unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _renderItem = ({item}) => {
    return (
      <SearchItem
        onPress={() =>
          navigation.navigate('SubCategories', {
            serviceId: item.id,
            serviceName: item.service_name,
          })
        }
        image={item.service_icon}
        title={
          item.child_cat
            ? item.subcategory_name + '-' + item.child_cat
            : item.subcategory_name
        }
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={I18n.t('search')}
        onChangeText={onSearchHandler}
        value={search}
        style={styles.textInputStyle}
        autoFocus={true}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredDataSource}
        keyExtractor={item => item.id + Math.random().toString()}
        renderItem={_renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    fontSize: RFValue(15),
    alignSelf: 'center',
    paddingHorizontal: RFValue(15),
  },
  textInputStyle: {
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  cardContainer: {
    marginHorizontal: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(8),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgContainer: {
    width: RFValue(50),
    height: RFValue(50),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllServiceScreen;
