import _ from 'underscore';

export const getVolume = state => _.get(state, ['settings', 'userPreferences', 'volume'], null);

export const getOsuSongPath = state => _.get(state, ['settings', 'userPreferences', 'osuSongsPath'], null);
