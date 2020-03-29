import { createStore, applyMiddleware } from 'redux';
import { logger } from '../middleware';
import thunk from 'redux-thunk';
import { rootReducer } from '../reducers/';

export function configureStore (initialState) {
    let middleware = applyMiddleware(...[logger, thunk]);
    const store = createStore(rootReducer, initialState, middleware);
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers/index').default;
            store.replaceReducer(nextReducer);
        });
    }
    return store;
}
