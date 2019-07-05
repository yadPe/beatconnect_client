const initialState = {
  mpMatchs: []
};

const reducer = (state = initialState, action) => {
  const { type, newMatchs } = action;
  switch (type) {
    case 'UPDATE_MATCHS_LIST':
      console.log('REDUCER', newMatchs)
      return { ...state, mpMatchs: newMatchs };
    default:
      return state;
  }
};

export default reducer;