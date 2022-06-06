const initialState = {
  collections: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET-OSU-COLLECTIONS':
      return { ...state, collections: payload };
    case 'CLEAR-OSU-COLLECTIONS':
      return { ...state, collections: initialState.collections };
    default:
      return state;
  }
};
