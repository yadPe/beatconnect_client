import { createStore, combineReducers } from 'redux';
import bot from '../Bot/reducer';
import settings from '../App/modules/Settings/reducer/reducer';
import beatmaps from '../App/modules/Beatmaps/reducer/reducer';
import navigation from '../App/modules/reducer';
import packs from '../App/modules/Packs/reducer/reducer';
import app from '../App/reducer';

const rootReducer = combineReducers({ bot, settings, beatmaps, navigation, packs, app });

export default createStore(rootReducer);

// eslint-disable-next-line no-undef
console.log('BEATCONNECT_CLIENT_GA_TRACKING_ID', process.env.BEATCONNECT_CLIENT_GA_TRACKING_ID);
