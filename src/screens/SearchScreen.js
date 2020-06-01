import React, { useState, useReducer, useEffect } from 'react';
import { TextInput, Text, StyleSheet, View, Dimensions } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ON_CITY_SELECT, ON_CITY_LOAD, ON_CITY_REMOVE } from '../state/const';
import fetchCities from '../api/cities';
import { getFavCities, saveBatch } from '../misc';
import selectedCityListReducer, {
  selectedCityListInitialState,
} from '../state/selectLocationReducer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    height: 50,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  searchIcon: {
    padding: 10,
  },
  textInput: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    backgroundColor: '#fff',
    width: Dimensions.get('screen').width - 80,
    color: '#424242',
  },
  textList: {
    marginTop: 5,
    padding: 7.5,
    paddingTop: 10,
  },
  suggestedList: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'column-reverse',
    width: Dimensions.get('screen').width - 80,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  cityListWrapper: {
    flexDirection: 'column',
    marginTop: 20,
  },
  favoriteCityTextItem: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  favoriteCityItemWrapper: {
    marginLeft: 20,
    marginRight: 20,
  },
  favoriteCityItemRowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteCityItemDeleteIcon: {
    color: 'red',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default function SearchScreen() {
  const [enteredCity, setEnteredCity] = useState('');
  const [suggestedCities, setSuggestedCities] = useState([]);

  const [state, dispatch] = useReducer(
    selectedCityListReducer,
    selectedCityListInitialState
  );

  const getItems = async () => {
    await getFavCities('favCities')
      .then((cityList) => {
        dispatch({
          type: ON_CITY_LOAD,
          payload: cityList,
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    if (state.length > 4) setEnteredCity('');
    getItems();
  }, [state.length]);

  const handleOnChange = (data) => {
    setEnteredCity(data);
    const result = fetchCities(data);
    setSuggestedCities(result);
  };

  const renderCities = (dataSrc, renderFunc) => {
    return (
      <View style={styles.cityListWrapper}>
        <FlatList
          data={dataSrc}
          renderItem={renderFunc}
          keyExtractor={(item) => `Key:${item.city.id}`}
        />
      </View>
    );
  };

  const renderRow = ({ item }) => {
    return (
      <View style={styles.favoriteCityItemWrapper}>
        <View style={styles.favoriteCityItemRowWrapper}>
          <Text style={styles.favoriteCityTextItem}>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {item.city.name}, {item.city.country}
          </Text>
          <View>
            <TouchableOpacity
              onPress={async () => {
                await getItems();
                dispatch({
                  type: ON_CITY_REMOVE,
                  payload: item.city.id,
                });
              }}
            >
              <FeatherIcon
                style={styles.favoriteCityItemDeleteIcon}
                name="trash-2"
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <FeatherIcon style={styles.searchIcon} name="search" size={20} />
        <TextInput
          editable={state.length < 5}
          placeholder={
            state.length < 5
              ? 'Search location'
              : 'Maximum of 5 locations can be picked'
          }
          placeholderTextColor="grey"
          style={styles.textInput}
          onChangeText={(e) => handleOnChange(e)}
          // eslint-disable-next-line no-nested-ternary
          value={enteredCity}
        />
      </View>
      <View style={styles.suggestedList}>
        {suggestedCities.map((item) => {
          return (
            <TouchableOpacity key={item.id}>
              <Text
                style={styles.textList}
                onPress={() => {
                  setEnteredCity(item.name);
                  setSuggestedCities([]);

                  // Only store the result if it is new
                  if (state.findIndex((e) => e.city.id === item.id) === -1) {
                    saveBatch('favCities', item).then(
                      (res) =>
                        // eslint-disable-next-line implicit-arrow-linebreak
                        dispatch({ type: ON_CITY_SELECT, payload: res })
                      // eslint-disable-next-line function-paren-newline
                    );
                  }
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {state.length > 0 ? renderCities(state, renderRow) : null}
    </View>
  );
}
