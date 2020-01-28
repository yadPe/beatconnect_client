export default {
  packs: `${process.env.BEATCONNECT_HOST_URL}/api/packs/${process.env.BEATCONNECT_TOKEN}`,
  weeklyPacks: `${process.env.BEATCONNECT_HOST_URL}/api/packs/weekly/${process.env.BEATCONNECT_TOKEN}`,
  searchBeatmaps: `${process.env.BEATCONNECT_HOST_URL}/api/search/${process.env.BEATCONNECT_TOKEN}`,
};
