const initialState = {
  connected: false,
  mpMatchs: [],
  instance: {},
  errors: [],
};

export default (state = initialState, { type, newMatchs, status, bot, newMatch, payload }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      return { ...state, mpMatchs: state.mpMatchs.map(match => (match.id === newMatch.id ? newMatch : match)) };
    case 'CONNECT':
      return { ...state, connected: status || true, bot: bot || state.bot };
    case 'DISCONNECT':
      return { ...state, connected: false };
    case 'ERROR':
      return { ...state, errors: [...state.errors, payload] };
    default:
      return state;
  }
};
