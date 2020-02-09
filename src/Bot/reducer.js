const initialState = {
  connected: false,
  mpMatchs: [],
  instance: {},
  errors: [],
};

export default (state = initialState, { type, newMatchs, newMatch, payload }) => {
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      return { ...state, mpMatchs: [...newMatchs] };
    case 'UPDATE_SINGLE_MATCH':
      return { ...state, mpMatchs: state.mpMatchs.map(match => (match.id === newMatch.id ? newMatch : match)) };
    case 'CONNECT':
      return { ...state, connected: payload.status || true, instance: payload.instance || state.instance };
    case 'CONNECTED':
      return { ...state, connected: true };
    case 'DISCONNECT':
      return { ...state, connected: false };
    case 'DESTROY_BOT_INSTANCE': {
      return { ...state, instance: {} };
    }
    case 'ERROR':
      return { ...state, errors: [...state.errors, payload] };
    default:
      return state;
  }
};
