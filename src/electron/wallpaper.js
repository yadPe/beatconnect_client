const { app } = require('electron');
const { createWriteStream } = require('fs');
const { set } = require('wallpaper');
const { get } = require('https');
const { join } = require('path');

const downloadAndSetWallpaper = uri =>
  new Promise((resolve, reject) => {
    const savePath = join(app.getPath('temp'), 'bg.jpg');
    const file = createWriteStream(savePath);
    const request = get(uri, res => {
      res.pipe(file);
      res.once('end', () => {
        if (res.statusCode !== 200) {
          file.destroy(new Error(`Server returned status code ${res.statusCode}`));
        } else file.close();
      });
    });
    const onError = err => {
      file.removeAllListeners();
      request.removeAllListeners();
      reject(err);
    };
    file.once('close', () => {
      file.removeAllListeners();
      resolve(set(savePath));
    });
    file.once('error', onError);
    request.once('error', onError);
  });

module.exports = { downloadAndSetWallpaper };
