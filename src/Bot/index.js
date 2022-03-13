import Bot from './Bot';
import store from '../shared/store';
import { getOsuApiKey } from '../App/modules/Settings/reducer/selectors';

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
    console.log('connecting using new Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting', instance: new Bot(botSettings) } });
  } else if (connected) {
    console.log('disconnecting');
    instance.disconnect();
  } else {
    console.log('connecting using existing Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting' } });
    instance.connect();
  }
};
