import { webFrame } from 'electron';

/**
 * Action creator will call clearCache as a side effect
 * @param {string} sectionName
 * @param {Record<string, any>} params
 * @returns
 */
export const changeCurrentSection = (sectionName, params = {}) => {
  // Used to clear web frame cache especially images when changing section since there is no real navigation in the app for chromium to to it by itself
  webFrame.clearCache();
  return {
    type: 'UPDATEACTIVESECTION',
    payload: { sectionName, params },
  };
};

export const clearSectionParams = () => ({
  type: 'CLEAR_ACTIVE_SECTION_PARAMS',
});
