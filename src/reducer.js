const initialState = {
  connected: false,
  mpMatchs: [],
  bot: {},
  BeatconnectApi: {},
  searchResults: {
    query: '',
    beatmaps: []
  },
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

export default (state = initialState, { type, newMatchs, status, bot, searchResults, newMatch }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      let { mpMatchs } = state;
      mpMatchs = mpMatchs.map(match => match.id === newMatch.id ? newMatch : match)
      return { ...state, mpMatchs: [...mpMatchs] };
    case 'CONNECT':
      console.log('CONNECTEDD', { ...state, connected: status || true, bot })
      return { ...state, connected: status || true, bot : bot || state.bot };
    case 'DISCONNECT':
      console.log('CONNECTEDD', { ...state, connected: false })
      return { ...state, connected: false };
    case 'SEARCH_RESULTS':
      console.log('SEARCH_RESULTS', { searchResults })
      return { ...state, searchResults };
    default:
      return state;
  }
};
