import './App/resize';
import _ from 'underscore';

const initialState = {
  connected: false,
  activeSection: 'Packs',
  mpMatchs: [],
  bot: {},
  BeatconnectApi: {},
  window: { width: window.innerWidth, height: window.innerHeight },
  searchResults: {
    search: { query: '', mode: 'all', status: 'ranked', page: 0 },
    beatmaps: new Array(8).fill(0),
  },
  errors: [],
  downloadQueue: [],
  fetchingBeatmaps: {},
};

export default (state = initialState, { type, newMatchs, status, bot, searchResults, newMatch, payload }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      console.log('UPDATE_MATCHS_LIST');
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      console.log('UPDATE_SINGLE_MATCH');
      let { mpMatchs } = state;
      mpMatchs = mpMatchs.map(match => (match.id === newMatch.id ? newMatch : match));
      return { ...state, mpMatchs: _.clone(mpMatchs) };
    case 'CONNECT':
      return { ...state, connected: status || true, bot: bot || state.bot };
    case 'DISCONNECT':
      return { ...state, connected: false };
    case 'SEARCH_RESULTS':
      return { ...state, searchResults };
    case 'RESIZE':
      return { ...state, window: payload };
    case 'UPDATEACTIVESECTION':
      return { ...state, activeSection: payload };
    case 'SAVEBEATMAPSSCROLLPOS':
      console.log({ ...state.searchResults, lastScroll: payload });
      return { ...state, searchResults: { ...state.searchResults, lastScroll: payload } };
    case 'FETCHINGBEATMAPS':
      console.log('FETCHINGBEATMAPS', payload);
      return { ...state, fetchingBeatmaps: payload };
    case 'ERROR':
      const { errors } = state;
      errors.push(payload);
      return { ...state, errors: [...errors] };
    default:
      return state;
  }
};
