const { Worker } = require('worker_threads');
const { error } = require('electron-log');
const { join } = require('path');

let worker;
let pullIntervalId;
const startPullingOsuState = handler => {
  if (worker && pullIntervalId) {
    throw new Error('startPullingOsuState was already called and is started to end it call the returned stop function');
  }
  worker = new Worker(join(__dirname, './osuIsRunning.worker.js'));
  pullIntervalId = setInterval(() => worker.postMessage('check-osu-state'), 10000);
  worker.on('message', data => {
    switch (data[0]) {
      case 'result':
        handler(data[1]);
        break;
      case 'error':
        error(`[osuIsRunning thread]: ${data[1]}`);
        break;
      default:
        break;
    }
  });
  const stopPullingOsuState = () => {
    clearInterval(pullIntervalId);
    worker.removeAllListeners();
    worker.terminate();
  };

  return stopPullingOsuState;
};

module.exports = startPullingOsuState;
