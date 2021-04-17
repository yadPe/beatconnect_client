import config from '../../shared/config';

const initialState = {
  activeSection: config.display.defaultSection,
  sectionParams: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'UPDATEACTIVESECTION':
      return { ...state, activeSection: payload.sectionName, sectionParams: payload.params };
    case 'CLEAR_ACTIVE_SECTION_PARAMS':
      return { ...state, sectionParams: initialState.sectionParams };
    default:
      return state;
  }
};
