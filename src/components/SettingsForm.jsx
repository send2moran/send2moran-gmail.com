import React from 'react';
import { connect } from 'react-redux';
import { clear, toggleMap } from '../actions/map';

const mapStateToProps = (state, _ownProps) => ({
    mapType: state.app.mapType
});

export default connect(mapStateToProps)(({ mapType, dispatch }) => {
    const clearMarkers = e => {
        e.preventDefault();
        dispatch(clear());
    };

    const setMapType = e => {
        e.preventDefault();
        dispatch(toggleMap());
    };

    return (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <button
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                onClick={clearMarkers}>
                Clear Map
            </button>
            <button
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 mt-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                onClick={setMapType}>
                View Map As: {mapType.toUpperCase()} (toggle)
            </button>
        </form>
    );
});
