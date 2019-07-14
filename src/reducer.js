const initialState = {
  connected: false,
  mpMatchs: [],
  bot: {},
  theme: {
    style: 'dark',
    primary: '#121212',
    secondary: '#2a2a2a',
    warning: '#ed2828',
    color: '#00965f', 
    title: 'Beatconnect'
  }
};

const reducer = (state = initialState, action) => {
  const { type, newMatchs } = action;
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      console.log('REDUCER', newMatchs)
      return { ...state, mpMatchs: [...newMatchs] };
    case 'CONNECT':
      console.log('CONNECTEDD', { ...state, connected: action.status || true })
      return { ...state, connected: action.status || true, bot : action.bot || state.bot };
    default:
      return state;
  }
};

export default reducer;