import { remote } from 'electron';
import store from '../shared/store';

const { trackEvent } = remote.getGlobal('tracking');

export const connectBot = instance => {
  store.dispatch({ type: 'CONNECT', status: 'connecting', instance });
  trackEvent('bot', 'connect');
};
export const disconnectBot = () => store.dispatch({ type: 'DISCONNECT' });
export const updateMatchsList = newMatchs => {
  store.dispatch({ type: 'UPDATE_MATCHS_LIST', newMatchs });
  trackEvent('bot', 'matchs', 'connectedMatchsCount', newMatchs.length || 0);
};
export const updateSingleMatch = matchUpdate => {
  const newMatchs = store.getState().bot.mpMatchs.map(match => (match.id === matchUpdate.id ? matchUpdate : match));
  store.dispatch({ type: 'UPDATE_SINGLE_MATCH', newMatchs });
  trackEvent('bot', 'matchs', 'connectedMatchsCount', newMatchs.length || 0);
};
