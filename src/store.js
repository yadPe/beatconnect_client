import { createStore, combineReducers } from 'redux';
import main from './reducer';
import settings from './App/components/Settings/reducer';

const rootReducer = combineReducers({ main, settings });

export default createStore(rootReducer);
