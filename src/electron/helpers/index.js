const { promises: fs } = require('fs');
const path = require('path');

const readableBits = (bytes, decimals) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1000;
  const dm = decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // Ready till Yottabyte/s connection speeds
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const makeDownloadUrl = ({ beatmapSetId, uniqId }) => `https://beatconnect.io/b/${beatmapSetId}/${uniqId}/?nocf=1`;

const removeProtocolPrefix = (str = '', protocolString) => str.slice(protocolString.length);
const getBeatconnectProtocolParams = (argv = [''], protocol) => {
  const protocolString = `${protocol}://`;
  const protocolLink = argv.find(arg => arg.startsWith(protocolString));
  if (protocolLink) return removeProtocolPrefix(protocolLink, protocolString);
  return undefined;
};

async function exists(...paths) {
  console.log('path.sus', path.join(...paths));
  try {
    await fs.access(path.join(...paths));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  readableBits,
  makeDownloadUrl,
  getBeatconnectProtocolParams,
  removeProtocolPrefix,
  exists,
};
