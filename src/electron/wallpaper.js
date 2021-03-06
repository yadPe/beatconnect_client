const { app } = require('electron');
const { createWriteStream } = require('fs');
const { get } = require('https');
const { join } = require('path');
const wallpaper = require('./helpers/wallpaper');

const tempFolder = app.getPath('userData');
const downloadAndSetWallpaper = uri =>
  process.platform !== 'win32'
    ? null
    : new Promise((resolve, reject) => {
        const savePath = join(tempFolder, 'bg.jpg');
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
          resolve(wallpaper.set(savePath));
        });
        file.once('error', onError);
        request.once('error', onError);
      });

module.exports = { downloadAndSetWallpaper };
