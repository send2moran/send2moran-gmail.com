/* eslint-disable no-console */
/* eslint-disable no-debugger */
import axios from 'axios';

const API_KEY = 'E5ZFXHxDk49Zno9gFj3pOjTO3xDmnOru2wrDKdH8TAE';
export const searchGeocode = async (address = 'Tel+Aviv') => {
    try {
        //https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
        const { data: response } = await axios.get(
            `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${API_KEY}&lang=english`
        );
        return response.items;
    } catch (error) {
        throw error.response.data;
    }
};
