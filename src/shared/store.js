import { createStore, combineReducers } from 'redux';
import bot from '../Bot/reducer';
import settings from '../App/modules/Settings/reducer/reducer'; // TODO Dependency cycle
import beatmaps from '../App/modules/Beatmaps/reducer/reducer';
import navigation from '../App/modules/reducer';
import packs from '../App/modules/Packs/reducer/reducer';
import library from '../App/modules/Collections/reducer';
import app from '../App/reducer';

const rootReducer = combineReducers({ bot, settings, beatmaps, navigation, packs, library, app });

/* eslint-disable no-underscore-dangle */
export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
/* eslint-enable */
