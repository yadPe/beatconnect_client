import { createStore, combineReducers } from 'redux';
import main from './reducer';
import settings from './App/components/Settings/reducer';
import beatmaps from './App/components/Beatmaps/reducer/reducer';

const rootReducer = combineReducers({ main, settings, beatmaps });

export default createStore(rootReducer);
