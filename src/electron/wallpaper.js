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
          const error = new Error(`Server returned status code ${res.statusCode}`);
          file.destroy(error);
        } else file.close();
      });
    });
    file.once('close', () => {
      file.removeAllListeners();
      resolve(set(savePath));
    });
    file.once('error', err => {
      file.removeAllListeners();
      reject(err);
    });
    request.once('error', err => {
      file.removeAllListeners();
      reject(err);
    });
  });

module.exports = { downloadAndSetWallpaper };
