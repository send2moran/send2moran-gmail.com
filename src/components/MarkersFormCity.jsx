import React from 'react';
import { connect } from 'react-redux';
import { addCity } from '../actions/map';
import AutoComplete from '../components/AutoComplete';
import { searchGeocode } from '../services/api';

export default connect()(({ dispatch }) => {
    const selectedHandle = city => {
        dispatch(addCity([{ lat: city.position.lat, lng: city.position.lng }]));
    };

    return (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <fieldset>
                <legend>Add By City Search:</legend>
                <div className="mt-2">
                    <AutoComplete onSearch={searchGeocode} onSelected={selectedHandle} debounce={500} />
                </div>
            </fieldset>
        </form>
    );
});
