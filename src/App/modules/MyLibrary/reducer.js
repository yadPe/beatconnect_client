const initialState = {
  collections: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET-OSU-COLLECTIONS':
      return { ...state, collections: payload };
    default:
      return state;
  }
};
