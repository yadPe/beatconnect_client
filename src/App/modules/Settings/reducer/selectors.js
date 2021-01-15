import _ from 'underscore';

export const getVolume = state => _.get(state, ['settings', 'userPreferences', 'volume'], null);
