import Bot from './Bot';
import store from '../shared/store';

export default () => {
  const { settings, bot } = store.getState();
  const { connected, instance } = bot;
  if (!instance.connect) {
    console.log('connecting using new Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting', instance: new Bot(settings) } });
  } else if (connected) {
    console.log('disconnecting');
    instance.disconnect();
  } else {
    console.log('connecting using existing Bot');
    store.dispatch({ type: 'CONNECT', payload: { status: 'connecting' } });
    instance.connect();
  }
};
