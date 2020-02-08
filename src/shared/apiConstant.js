/* eslint-disable no-undef */
const beatconnectHostUrl = 'https://beatconnect.io';
const beatconnectApiToken = process.env.BEATCONNECT_CLIENT_TOKEN;

export default {
  packs: `${beatconnectHostUrl}/api/packs/?token=${beatconnectApiToken}`,
  weeklyPacks: `${beatconnectHostUrl}/api/packs/weekly/?token=${beatconnectApiToken}`,
  searchBeatmaps: (query, page, status, mode) =>
    `${beatconnectHostUrl}/api/search/?token=${beatconnectApiToken}&p=${page || 0}&q=${query}&s=${status ||
      'ranked'}&m=${mode || 'all'}`,
  getBeatmapById: beatmapsSetId => `${beatconnectHostUrl}/api/beatmap/${beatmapsSetId}/?token=${beatconnectApiToken}`,
};
