import Bot from './Bot';
import store from '../shared/store';

export default () => {
  const { settings, bot } = store.getState();
  const { connected, instance } = bot;
  if (!instance.connect) {
    console.log('connecting using new Bot');
    store.dispatch({ type: 'CONNECT', status: 'connecting', instance: new Bot(settings) });
  } else if (connected) {
    console.log('disconnecting');
    store.dispatch({ type: 'DISCONNECT' });
    instance.disconnect();
  } else {
    console.log('connecting using existing Bot');
    store.dispatch({ type: 'CONNECT', status: 'connecting' });
    instance.connect();
  }
};
