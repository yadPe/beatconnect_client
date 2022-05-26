import _ from 'underscore';

export const getUserPreference = state => _.get(state, ['settings', 'userPreferences'], null);

export const getVolume = state => _.get(getUserPreference(state), ['volume'], null);

export const getOsuSongPath = state => _.get(getUserPreference(state), ['osuSongsPath'], null);

export const getOsuPath = state => _.get(getUserPreference(state), ['osuPath'], null);

export const getOsuApiKey = state => {
  let apiKey = _.get(getUserPreference(state), ['osuApi', 'key'], '');
  return _.isEmpty(apiKey.trim()) ? process.env.BEATCONNECT_CLIENT_API_KEY_V1 : apiKey;
};

export const getIsLazer = state => _.get(getUserPreference(state), ['isLazer'], false);
