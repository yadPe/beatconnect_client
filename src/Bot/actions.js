import { trackEvent } from '../App/helpers/tracking';
import store from '../shared/store';

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
  const matchCount = store.getState().bot.mpMatchs.length;
  store.dispatch({ type: 'UPDATE_SINGLE_MATCH', newMatch: matchUpdate });
  trackEvent('bot', 'matchs', 'connectedMatchsCount', matchCount || 0);
};
