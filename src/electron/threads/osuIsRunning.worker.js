const { parentPort } = require('worker_threads');
const { lookup } = require('ps-node');

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
