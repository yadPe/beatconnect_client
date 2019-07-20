const initialState = {
  connected: false,
  mpMatchs: [],
  bot: {},
  searchResults: [],
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

export default (state = initialState, { type, newMatchs, status, bot, searchResults }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      console.log('REDUCER', newMatchs)
      return { ...state, mpMatchs: [...newMatchs] };
    case 'CONNECT':
      console.log('CONNECTEDD', { ...state, connected: status || true })
      return { ...state, connected: status || true, bot : bot || state.bot };
    case 'SEARCH_RESULTS':
      console.log('SEARCH_RESULTS', { ...state, searchResults })
      return { ...state, searchResults };
    default:
      return state;
  }
};
