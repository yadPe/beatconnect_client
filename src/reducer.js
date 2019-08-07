const initialState = {
  connected: false,
  mpMatchs: [],
  bot: {},
  BeatconnectApi: {},
  searchResults: {
    search: { query: '', mode: 'all', status: 'ranked' },
    beatmaps: []
  },
  errors:[],
  downloadQueue: [],
  theme: {
    style: 'dark',
    primary: '#121212',
    secondary: '#2a2a2a',
    warning: '#ed2828',
    color: '#00965f', 
    title: 'Beatconnect'
  }
};

export default (state = initialState, { type, newMatchs, status, bot, searchResults, newMatch, payload }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      let { mpMatchs } = state;
      mpMatchs = mpMatchs.map(match => match.id === newMatch.id ? newMatch : match)
      return { ...state, mpMatchs: [...mpMatchs] };
    case 'CONNECT':
      return { ...state, connected: status || true, bot : bot || state.bot };
    case 'DISCONNECT':
      return { ...state, connected: false };
    case 'SEARCH_RESULTS':
      return { ...state, searchResults };
    case 'ERROR':
      const {errors} = state;
      errors.push(payload)
      return { ...state, errors: [...errors]};
    default:
      return state;
  }
};
