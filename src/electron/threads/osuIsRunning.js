const { Worker, isMainThread, parentPort } = require('worker_threads');
const { lookup } = require('ps-node');
const { error } = require('electron-log');

if (isMainThread) {
  let worker;
  let pullIntervalId;
  const startPullingOsuState = handler => {
    if (worker && pullIntervalId) {
      throw new Error(
        'startPullingOsuState was already called and is started to end it call the returned stop function',
      );
    }
    worker = new Worker(__filename);
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
} else {
  let isBusy = false;
  parentPort.on('message', data => {
    if (data === 'check-osu-state' && !isBusy) {
      isBusy = true;
      lookup(
        {
          command: 'osu!.exe',
        },
        (err, resultList) => {
          if (err) {
            parentPort.postMessage(['error', err.message]);
          } else {
            parentPort.postMessage(['result', !!resultList.length]);
          }
          isBusy = false;
        },
      );
    }
  });
}
