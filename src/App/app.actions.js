export const changeCurrentSection = (sectionName, params = {}) => ({
  type: 'UPDATEACTIVESECTION',
  payload: { sectionName, params },
});

export const clearSectionParams = () => ({
  type: 'CLEAR_ACTIVE_SECTION_PARAMS',
});
