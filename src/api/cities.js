import cityList from '../data/city.list.json';

// Search the city.list.json file for cities
const fetchCities = (searchTerm) => {
  let termMatch = [];

  if (searchTerm.length > 2) {
    termMatch = cityList.filter((value) => {
      const regex = new RegExp(`^${searchTerm}`, 'gi');
      return value.name.match(regex);
    });
  }
  return termMatch;
};

export default fetchCities;
