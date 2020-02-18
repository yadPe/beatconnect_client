const { existsSync, writeFile } = require('fs');
const { normalize } = require('path');
const wallpaper = require('wallpaper');
const { request } = require('https');
const Stream = require('stream').Transform;

const downloadBg = uri =>
  new Promise((resolve, reject) => {
    request(uri, res => {
      const data = new Stream();
      res.on('data', data.push);
      res.on('end', () => resolve(writeFile('bg.jpg', data.read())));
    });
  });

const setWallpaper = imagePath => {
  if (existsSync(imagePath)) {
    wallpaper.set(imagePath);
  }
};

setTimeout(() => {
  const path = normalize('C:\\Users\\AssAs\\Downloads\\téléchargé.jpg');
  // console.log('setting wallpapapap');
  downloadBg('https://beatconnect.io/bg/1076733/2256206/').then(() => console.log('dl term'));
  // wallpaper.set(path);
}, 5000);

module.exports = { setWallpaper };
