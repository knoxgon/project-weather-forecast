import { AsyncStorage } from 'react-native';

const fetchForecast = async (key, cityInput, storageItem) => {
  const rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${cityInput.coord.lat}&lon=${cityInput.coord.lon}&exclude=minutely,hourly,current&cnt=5&units=metric&appid=3de337f7afb2ba2e6f70095f75e2b9ef`
  );
  const forecastResult = await rawData.json();
  // If there is record in the storage, just concat it
  if (storageItem) {
    const newCitySet = [
      ...JSON.parse(storageItem),
      { city: cityInput, forecast: forecastResult.daily },
    ];
    await AsyncStorage.setItem(key, JSON.stringify(newCitySet));
    return newCitySet;
  }
  // Else, convert to array and put it in
  const objArray = [];
  objArray.push({ city: cityInput, forecast: forecastResult.daily });
  await AsyncStorage.setItem(key, JSON.stringify(objArray));
  return objArray;
};

export const saveBatch = async (key, cityInput) => {
  // Get existing data
  const storageItem = await AsyncStorage.getItem(key);
  // Send the data along with input
  return fetchForecast(key, cityInput, storageItem);
};

export const removeBatchElement = async (key, itemId) => {
  // Retrieve data from the storage
  const rawCityList = await AsyncStorage.getItem(key);
  // Parse the retrieved data
  const cityList = JSON.parse(rawCityList);
  // Remove the retieved data from the array
  const newCityList = cityList.filter((item) => item.city.id !== itemId);
  // Apply the new dataset back to the storage
  await AsyncStorage.setItem(key, JSON.stringify(newCityList));
};

export const getFavCities = async (key) => {
  const result = await AsyncStorage.getItem(key);
  return JSON.parse(result) || [];
};
