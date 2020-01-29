/* eslint-disable no-undef */
const beatconnectHostUrl = 'https://beatconnect.io/';
export default {
  packs: `${beatconnectHostUrl}/api/packs/${BEATCONNECT_CLIENT_TOKEN}`,
  weeklyPacks: `${beatconnectHostUrl}/api/packs/weekly/${BEATCONNECT_CLIENT_TOKEN}`,
  searchBeatmaps: `${beatconnectHostUrl}/api/search/${BEATCONNECT_CLIENT_TOKEN}`,
};
