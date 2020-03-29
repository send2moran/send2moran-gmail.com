import React from 'react';
import { connect } from 'react-redux';
import { addMarker } from '../actions/map';

const mapStateToProps = (state, _ownProps) => ({
    selectedPhoto: state.app.selectedPhoto
});

export default connect(mapStateToProps)(({ selectedPhoto, dispatch }) => {
    const handleSubmit = e => {
        e.preventDefault();
        const data = new FormData(e.target);
        dispatch(addMarker({ lat: Number(data.get('lat')), lng: Number(data.get('lng')) }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <fieldset>
                <legend>Add Marker By:</legend>
                <div className="flex flex-wrap -mx-3 pt-3 mt-2">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="lat"
                            name="lat"
                            type="text"
                            placeholder="Latitude"
                        />
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="lng"
                            name="lng"
                            type="text"
                            placeholder="Longitude"
                        />
                    </div>
                </div>
                <button className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mb-3 px-4 rounded">
                    Add Marker
                </button>
            </fieldset>
        </form>
    );
});
