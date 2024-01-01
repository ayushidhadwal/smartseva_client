import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  Text,
  Pressable,
  FlatList,
  Platform,
  TouchableHighlight,
} from 'react-native';
import {Modal, Portal, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

export const SearchableDropdown = ({
  label,
  data,
  onSelectValue,
  selectedValue,
  leftIcon,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [search, setSearch] = useState('');
  const [item, setItem] = useState('');
  const [itemValue, setItemValue] = useState(selectedValue);
  const [filteredList, setFilteredList] = useState([]);

  const showModal = () => setVisible(true);

  const onSelectItem = ({name, value}) => {
    setItem(name);
    setItemValue(value);
    setVisible(false);
    onSelectValue(value);
    // set the value for api
  };

  useEffect(() => {
    const x = [...data];
    const a = x.find(m => m.value === selectedValue);
    if (a) {
      setItem(a.name);
    }
  }, [data, selectedValue]);

  useEffect(() => {
    setFilteredList([...data]);
  }, [data]);

  const searchValue = useCallback(
    text => {
      setSearch(text);
      if (text !== '') {
        const filterData = filteredList.filter(m =>
          m.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredList([...filterData]);
      } else {
        setFilteredList([...data]);
      }
    },
    [filteredList],
  );

  return (
    <>
      <Pressable onPress={showModal}>
        <View pointerEvents={'none'}>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            editable={false}
            label={label}
            style={styles.input}
            value={item}
            showSoftInputOnFocus={false}
            right={
              <TextInput.Icon name={'chevron-down'} color={'black'} size={20} />
            }
            left={leftIcon}
          />
        </View>
      </Pressable>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.containerStyle}>
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={'Search'}
            style={styles.input}
            value={search}
            onChangeText={searchValue}
            right={
              <TextInput.Icon name={'search-web'} color={'black'} size={20} />
            }
          />
          {filteredList.length === 0 ? (
            <Text
              style={{
                color: 'black',
                marginVertical: 8,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 13,
              }}>
              Not Found
            </Text>
          ) : (
            <FlatList
              keyExtractor={i => i.key}
              data={filteredList}
              renderItem={({item: itemName}) => (
                <TouchableHighlight
                  style={
                    itemValue === itemName.value
                      ? styles.selectedName
                      : styles.name
                  }
                  underlayColor="red"
                  activeOpacity={0.6}
                  onPress={() =>
                    onSelectItem({name: itemName.name, value: itemName.value})
                  }>
                  <Text
                    style={
                      itemValue === itemName.value
                        ? styles.selectedNameStyle
                        : styles.nameStyle
                    }>
                    {itemName.name}
                  </Text>
                  {/*<Text style={}>{itemName.name}</Text>*/}
                </TouchableHighlight>
              )}
            />
          )}
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    marginBottom: RFValue(12),
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  name: {
    padding: 10,
  },
  nameStyle: {
    fontSize: RFValue(18),
  },
  selectedName: {
    backgroundColor: 'red',
    padding: 10,
    marginVertical: 10,
  },
  selectedNameStyle: {
    color: 'white',
    fontSize: RFValue(18),
  },
});
