// TODO make this work

// const readableBits = bytes => {
//   if (!bytes) return '0 b';
//   const i = Math.floor(Math.log(bytes) / Math.log(1024 / 8));
//   const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']; // Ready till Yottabyte/s connection speeds
//   // console.log(i);

//   return `${(bytes / (1024 / 8) ** i).toFixed(2) * 1} ${sizes[i]}`;
// };

const readableBits = (bytes, decimals) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1000;
  const dm = decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // Ready till Yottabyte/s connection speeds
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const convertTime = (input, separator) => {
  const pad = input => {
    return input < 10 ? '0' + input : input;
  };
  return [pad(Math.floor(input / 3600)), pad(Math.floor((input % 3600) / 60)), pad(Math.floor(input % 60))].join(
    typeof separator !== 'undefined' ? separator : ':',
  );
};

const makeDownloadUrl = ({ beatmapSetId, uniqId }) => `https://beatconnect.io/b/${beatmapSetId}/${uniqId}/?nocf=1`;

module.exports = {
  readableBits,
  makeDownloadUrl,
};
