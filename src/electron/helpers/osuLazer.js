const { open } = require('osu-lazer-db-reader');

const readLazerDb = async path => {
  const { beatmaps } = await open(path);
  return beatmaps;
};

module.exports = { readLazerDb };
