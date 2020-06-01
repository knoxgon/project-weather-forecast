/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import PageSlider from 'react-native-app-intro-slider';
import { getFavCities, dateTimeToDay, dateTimeToFullDate } from '../misc';

const styles = StyleSheet.create({
  // Upper page
  upperWrapper: {
    marginTop: 50,
  },
  addLocation: {
    alignSelf: 'flex-end',
    alignContent: 'center',
    fontSize: 32.5,
    width: 32.5,
    marginRight: 10,
    color: 'white',
  },
  locationName: {
    width: Dimensions.get('window').width - 100,
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
  locationDetail: {
    width: Dimensions.get('window').width - 100,
    alignSelf: 'center',
    position: 'absolute',
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  /**
   * Whole page
   */
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  touchWrapper: {
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'center',
    width: 40,
    fontSize: 32.5,
    color: 'white',
  },
  /**
   * Center page
   */
  centerScreenWrapper: {
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 40,
    marginTop: 40,
    marginBottom: 40,
    height: Dimensions.get('screen').height - 350,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd9d9',
    borderTopWidth: 0.3,
    borderTopColor: '#eae8e8',
  },
  temperatureDigit: {
    fontSize: 60,
    color: 'white',
  },
  temperatureMaxMinWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    textAlignVertical: 'bottom',
    alignItems: 'center',
  },
  temperatureMaxMinRowWrapper: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  temperatureMaxMinDigit: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  temperatureIcon: {
    fontSize: 30,
    color: 'white',
  },
  temperatureRowWrapper: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  // Background gradient
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: Dimensions.get('screen').height - 40,
  },
  /**
   * Bottom page
   */
  lowerWrapper: {
    marginLeft: 20,
    width: Dimensions.get('screen').width - 40,
    marginRight: 20,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  dayForecastWrapper: {
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 60) / 5,
  },
  dailyDay: {
    fontWeight: 'bold',
  },
  dailyTemp: {
    alignItems: 'center',
    flexDirection: 'row',
    fontWeight: 'normal',
  },
});

const HomeScreen = ({ navigation }) => {
  /**
   * --- City element members [root] ---
   * city.id
   * city.name
   * city.country
   * --- City elements members [forecast] ---
   * city.forecastDays[index].datetime
   * city.forecastDays[index].humidity
   * city.forecastDays[index].pressure
   * city.forecastDays[index].wind
   * city.forecastDays[index].temperature
   * city.forecastDays[index].minTemperature
   * city.forecastDays[index].maxTemperature
   * city.forecastDays[index].icon
   * city.forecastDays[index].situation
   */
  const [cities, setCities] = useState([]);

  const getAllCities = async () => {
    await getFavCities('favCities').then((allCities) => {
      allCities.forEach((cityInfo) => {
        const cityObject = {
          key: cityInfo.city.id.toString(),
          name: cityInfo.city.name,
          country: cityInfo.city.country,
        };
        // Iterate forecast (Today + 5 upcoming days)
        const forecastDays = [];
        for (let i = 0; i < 6; i++) {
          forecastDays.push({
            datetime: cityInfo.forecast[i].dt,
            humidity: cityInfo.forecast[i].humidity,
            pressure: cityInfo.forecast[i].pressure,
            wind: cityInfo.forecast[i].wind_speed,
            temperature: Math.round(cityInfo.forecast[i].temp.day),
            minTemperature: Math.round(cityInfo.forecast[i].temp.min),
            maxTemperature: Math.round(cityInfo.forecast[i].temp.max),
            icon: cityInfo.forecast[i].weather[0].icon,
            situation: cityInfo.forecast[i].weather[0].main,
          });
        }
        Object.assign(cityObject, { forecastDays });
        setCities((prevState) => [...prevState, cityObject]);
      });
    });
  };

  useEffect(() => {
    setCities([]);
    getAllCities();
  }, []);

  const renderDailyForecastItems = ({ item }) => {
    return (
      <View style={styles.dayForecastWrapper}>
        <Text style={styles.dailyDay}>{dateTimeToDay(item.datetime)}</Text>
        <Image
          source={{
            uri: `http://openweathermap.org/img/wn/${item.icon}@2x.png`,
          }}
          style={{ width: 40, height: 40 }}
        />
        <View style={styles.dailyTemp}>
          <Text>
            {item.temperature}
            °C
          </Text>
        </View>
      </View>
    );
  };

  const renderForecastDetails = (Component, propName, itemName, itemDetail) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#f2e1e1', fontWeight: 'bold' }}>
          {itemName}
        </Text>
        <Component name={propName} style={{ fontSize: 35, color: '#dbdbdb' }} />
        <Text style={{ fontSize: 16, color: '#f2e1e1', fontWeight: 'bold' }}>
          {itemDetail}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View style={styles.upperWrapper}>
          <Text style={styles.locationName}>
            {item.name}, {item.country}
          </Text>
          <Text style={styles.locationDetail}>
            {dateTimeToFullDate(item.forecastDays[0].datetime)}
          </Text>
          <View style={styles.touchWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Search');
              }}
            >
              <AntIcon name="plus" style={styles.addLocation} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.centerScreenWrapper}>
          <View>
            <View style={styles.temperatureMaxMinRowWrapper}>
              <Text style={styles.temperatureIcon}>
                {item.forecastDays[0].situation}
              </Text>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.forecastDays[0].icon}@2x.png`,
                }}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <View style={styles.temperatureRowWrapper}>
              <Text style={styles.temperatureDigit}>
                {item.forecastDays[0].temperature}
                °C
              </Text>
              <View style={styles.temperatureMaxMinWrapper}>
                <View style={styles.temperatureMaxMinRowWrapper}>
                  <AntIcon
                    name="arrowup"
                    style={styles.temperatureMaxMinDigit}
                  />
                  <Text style={styles.temperatureMaxMinDigit}>
                    {item.forecastDays[0].maxTemperature}
                    °C
                  </Text>
                </View>
                <View style={styles.temperatureMaxMinRowWrapper}>
                  <AntIcon
                    name="arrowdown"
                    style={styles.temperatureMaxMinDigit}
                  />
                  <Text style={styles.temperatureMaxMinDigit}>
                    {item.forecastDays[0].minTemperature}
                    °C
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            {renderForecastDetails(
              Ionicon,
              'ios-water',
              'Humidity',
              item.forecastDays[0].humidity
            )}
            {renderForecastDetails(
              FeatherIcon,
              'wind',
              'Wind',
              item.forecastDays[0].wind
            )}
            {renderForecastDetails(
              FontAwesomeIcon,
              'compress',
              'Pressure',
              item.forecastDays[0].pressure
            )}
          </View>
        </View>
        <View style={styles.lowerWrapper}>
          <FlatList
            contentContainerStyle={{
              alignItems: 'center',
            }}
            numColumns="5"
            data={item.forecastDays.slice(1)}
            renderItem={renderDailyForecastItems}
            keyExtractor={(extract, i) => i.toString()}
          />
        </View>
      </View>
    );
  };
  if (cities.length > 0) {
    return (
      <LinearGradient
        colors={['rgba(81, 198, 114, 1)', 'rgba(139, 153, 181, 1)']}
        style={styles.gradient}
      >
        <PageSlider
          renderItem={renderItem}
          data={cities}
          renderDoneButton={() => false}
          renderNextButton={() => false}
        />
      </LinearGradient>
    );
  }
  return (
    <LinearGradient
      colors={['rgba(24, 37, 94, 1)', 'rgba(144, 95, 159, 1)']}
      style={styles.gradient}
    >
      <View style={styles.upperWrapper}>
        <View style={styles.touchWrapper}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Search');
            }}
          >
            <AntIcon name="plus" style={styles.addLocation} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
