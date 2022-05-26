const { Worker } = require('worker_threads');
const { join } = require('path');
const { error } = require('electron-log');

const scanOsuDb = (osuDbPath, isLazer = false) =>
  new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, './osuSongsScan.worker.js'));
    const terminate = () => {
      worker.removeAllListeners();
      worker.terminate();
    };
    worker.on('message', data => {
      switch (data[0]) {
        case 'result':
          terminate();
          resolve(data[1]);
          break;
        case 'error':
          terminate();
          error(`[scanOsuDb thread]: ${data[1]}`);
          reject(data[1]);
          break;
        default:
          terminate();
          break;
      }
    });
    worker.postMessage({ osuDbPath, isLazer });
  });

module.exports = scanOsuDb;
