import { handleActions } from 'redux-actions';

export const defaultPosition = { lat: 32.0853, lng: 34.7818 };
const appState = {
    markers: [defaultPosition],
    city: [],
    mapType : 'bing'
};

export const appStateReducer = handleActions(
    {
        ADD_MARKER: {
            next: (state, action) => {
                return {
                    ...state,
                    markers: [...state.markers, action.payload],
                    city: []
                };
            }
        },
        ADD_CITY: {
            next: (state, action) => {
                '';
                return {
                    ...state,
                    markers: [],
                    city: action.payload
                };
            }
        },
        CLEAR: {
            next: state => {
                return {
                    ...state,
                    markers: [],
                    city: []
                };
            }
        },
        TOGGLE_MAP: {
            next: state => {
                return {
                    ...state,
                    mapType: state.mapType === 'google' ? 'bing' : 'google'
                };
            } 
        }
    },
    appState
);
