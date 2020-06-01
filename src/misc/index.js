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
