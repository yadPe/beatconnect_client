import ElectronLog from 'electron-log';
import Bot from './Bot';
import store from '../shared/store';
import { getOsuApiKey } from '../App/modules/Settings/reducer/selectors';

const logger = ElectronLog.scope('bot');

export default () => {
  const state = store.getState();
  const { bot } = state;
  const botSettings = {
    ...state.settings,
    userPreferences: {
      ...state.settings.userPreferences,
      osuApi: { ...state.settings.userPreferences.osuApi, key: getOsuApiKey(state) },
    },
  };

  const { connected, instance } = bot;

  if (!instance.connect) {
    logger.log('connecting using new Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting', instance: new Bot(botSettings) } });
  } else if (connected) {
    logger.log('disconnecting');
    instance.disconnect();
  } else {
    logger.log('connecting using existing Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting' } });
    instance.connect();
  }
};
