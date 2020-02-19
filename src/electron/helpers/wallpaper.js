const { app } = require('electron');
const { createWriteStream } = require('fs');
const { set } = require('wallpaper');
const { get } = require('https');
const { join } = require('path');

const downloadAndSetBg = uri =>
  new Promise((resolve, reject) => {
    const savePath = join(app.getPath('temp'), 'bg.jpg');
    const file = createWriteStream(savePath);
    const request = get(uri, res => {
      res.pipe(file);
      res.once('end', () => {
        if (res.statusCode !== 200) {
          file.destroy();
          reject(new Error(`Status code ${res.statusCode}`));
        } else file.close();
      });
    });
    file.once('close', () => {
      resolve(set(savePath));
    });
    request.on('error', reject);
  });

// setTimeout(() => {
//   downloadAndSetBg('https://beatconnect.io/bg/1041596/2176932/')
//     .then(() => console.log('new bg set!'))
//     .catch(err => console.log('failed', err.message));
//   // wallpaper.set(path);
// }, 5000);

module.exports = { setWallpaper: downloadAndSetBg };
