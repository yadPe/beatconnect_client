/* eslint-disable no-undef */
const beatconnectHostUrl = 'https://beatconnect.io';
export default {
  packs: `${beatconnectHostUrl}/api/packs/?token=${process.env.BEATCONNECT_CLIENT_TOKEN}`,
  weeklyPacks: `${beatconnectHostUrl}/api/packs/weekly/?token=${process.env.BEATCONNECT_CLIENT_TOKEN}`,
  searchBeatmaps: (query, page, status, mode) =>
    `${beatconnectHostUrl}/api/search/?token=${process.env.BEATCONNECT_CLIENT_TOKEN}&p=${page ||
      0}&q=${query}&s=${status || 'ranked'}&m=${mode || 'all'}`,
  getBeatmapById: beatmapsSetId =>
    `${beatconnectHostUrl}/api/beatmap/${beatmapsSetId}/?token=${process.env.BEATCONNECT_CLIENT_TOKEN}`,
};
