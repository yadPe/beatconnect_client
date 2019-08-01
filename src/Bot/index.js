import Bot from './Bot'
import store from '../store';

export default () => {
  const { settings, main } = store.getState();
  const { connected, bot } = main;
  if (!bot.connect) {
    console.log('connecting using new Bot')
    store.dispatch({ type: 'CONNECT', status: 'connecting', bot: new Bot(settings) })
  } else if (connected) {
    console.log('disconnecting')
    store.dispatch({ type: 'DISCONNECT' })
    bot.disconnect();
  } else {
    console.log('connecting using existing Bot')
    store.dispatch({ type: 'CONNECT', status: 'connecting' })
    bot.connect()
  }
}

