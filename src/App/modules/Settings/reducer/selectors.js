import _ from 'underscore';

export const getUserPreference = state => _.get(state, ['settings', 'userPreferences'], null);

export const getVolume = state => _.get(getUserPreference(state), ['volume'], null);

export const getOsuSongPath = state => _.get(getUserPreference(state), ['osuSongsPath'], null);

export const getOsuPath = state => _.get(getUserPreference(state), ['osuPath'], null);
