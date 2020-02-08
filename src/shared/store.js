import { createStore, combineReducers } from 'redux';
import bot from '../Bot/reducer';
import settings from '../App/modules/Settings/reducer/reducer';
import beatmaps from '../App/modules/Beatmaps/reducer/reducer';
import navigation from '../App/modules/reducer';
import packs from '../App/modules/Packs/reducer/reducer';
import app from '../App/reducer';

const rootReducer = combineReducers({ bot, settings, beatmaps, navigation, packs, app });

export default createStore(rootReducer);
