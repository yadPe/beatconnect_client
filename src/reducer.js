import './App/resize';
import { clone } from 'underscore';
import config from './shared/config';

const initialState = {
  connected: false,
  activeSection: config.display.defaultSection,
  mpMatchs: [],
  bot: {},
  BeatconnectApi: {},
  window: { width: window.innerWidth, height: window.innerHeight },
  errors: [],
  downloadQueue: [],
  packsDashboardData: {
    lastWeekOverview: [0, 0, 0, 0],
    std: {},
    ctb: {},
    mania: {},
    taiko: {},
  },
};

export default (state = initialState, { type, newMatchs, status, bot, newMatch, payload }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      let { mpMatchs } = state;
      mpMatchs = mpMatchs.map(match => (match.id === newMatch.id ? newMatch : match));
      return { ...state, mpMatchs: clone(mpMatchs) };
    case 'CONNECT':
      return { ...state, connected: status || true, bot: bot || state.bot };
    case 'DISCONNECT':
      return { ...state, connected: false };
    case 'PACKS_DASHBOARD_QUERY_DATA':
      return { ...state, packsDashboardData: { ...state.packsDashboardData, ...payload } };
    case 'RESIZE':
      return { ...state, window: payload };
    case 'UPDATEACTIVESECTION':
      return { ...state, activeSection: payload };
    case 'ERROR':
      const { errors } = state;
      errors.push(payload);
      return { ...state, errors: [...errors] };
    default:
      return state;
  }
};
