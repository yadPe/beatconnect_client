const initialState = {
  window: { width: window.innerWidth, height: window.innerHeight },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'RESIZE':
      return { ...state, window: payload };
    default:
      return state;
  }
};
