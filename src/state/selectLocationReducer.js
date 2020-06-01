import { ON_CITY_SELECT, ON_CITY_REMOVE, ON_CITY_LOAD } from './const';
import { removeBatchElement } from '../misc';

export const selectedCityListInitialState = [];

const selectedCityListReducer = (state, action) => {
  switch (action.type) {
    case ON_CITY_SELECT:
      return action.payload;
    case ON_CITY_LOAD:
      if (action.payload) return action.payload;
      return state;
    case ON_CITY_REMOVE:
      // Remove data from AsyncStorage
      removeBatchElement('favCities', action.payload);
      // Filter and return the new array
      return state.filter((elem) => elem.id !== action.payload);
    default:
      return state;
  }
};

export default selectedCityListReducer;
