import config from '../../shared/config';

const initialState = {
  activeSection: config.display.defaultSection,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'UPDATEACTIVESECTION':
      return { ...state, activeSection: payload };
    default:
      return state;
  }
};
