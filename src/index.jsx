import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import MapSelector from './components/MapSelector';
import MarkersForm from './components/MarkersForm';
import MarkersFormCity from './components/MarkersFormCity';
import SettingsForm from './components/SettingsForm';

import './styles/styles.css';

const store = configureStore();

function App () {
    return (
        <Provider store={store}>
            <div className="App">
                <div className="flex h-screen md:flex-row-reverse flex-wrap">
                    <div className="w-full text-left md:w-3/4 bg-gray-500 p-4 text-center text-gray-200">
                        <MapSelector/>
                    </div>
                    <div className="w-full text-left md:w-1/4 bg-gray-400 p-4 text-center text-gray-700">
                        <MarkersForm />
                        <MarkersFormCity />
                        <SettingsForm />
                    </div>
                </div>
            </div>
        </Provider>
    );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
