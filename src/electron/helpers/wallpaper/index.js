const win = require('./win');
const macos = require('./macos');

const init = () => {
  if (process.platform === 'darwin') return macos;
  if (process.platform === 'win32') return win;
  return null;
};

// https://github.com/sindresorhus/wallpaper
const wallpaper = init();

module.exports = wallpaper;
