const win = require('./win');

const init = () => {
  if (process.platform === 'win32') return win;
  return null;
};

// https://github.com/sindresorhus/wallpaper
const wallpaper = init();

module.exports = wallpaper;
