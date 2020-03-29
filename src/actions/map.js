import { createActions } from 'redux-actions';
export const { addMarker, addCity, clear, toggleMap } = createActions({
    ADD_MARKER: payload => payload,
    ADD_CITY: payload => payload,
    CLEAR: payload => payload,
    TOGGLE_MAP: payload => payload
});
