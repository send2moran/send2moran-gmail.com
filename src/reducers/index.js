import { combineReducers } from 'redux';
import { appStateReducer } from '../reducers/map';

export const rootReducer = combineReducers({
    app: appStateReducer
});

export {};
