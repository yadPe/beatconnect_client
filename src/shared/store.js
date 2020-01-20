import { createStore, combineReducers } from 'redux';
import main from '../reducer';
import settings from '../App/modules/Settings/reducer/reducer';
import beatmaps from '../App/modules/Beatmaps/reducer/reducer';

const rootReducer = combineReducers({ main, settings, beatmaps });

export default createStore(rootReducer);
