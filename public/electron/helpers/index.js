// TODO make this work

const readableBits = bytes => {
  if (!bytes) return '0 b';
  const i = Math.floor(Math.log(bytes) / Math.log(1024 / 8));
  const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']; // Ready till Yottabyte/s connection speeds
  // console.log(i);

  return `${(bytes / (1024 / 8) ** i).toFixed(2) * 1} ${sizes[i]}`;
};

const makeDownloadUrl = ({ beatmapSetId, uniqId }) => `https://beatconnect.io/b/${beatmapSetId}/${uniqId}/?nocf=1`;

module.exports = {
  readableBits,
  makeDownloadUrl,
};
