const { lookup } = require('ps-node');

const osuIsRuning = () => {
  lookup(
    {
      command: 'osu!.exe',
    },
    (err, resultList) => {
      if (err) {
        throw new Error(err);
      }
      process.send(resultList.length);
    },
  );
};

let pullIntervalId = null;
process.on('message', msg => {
  if (msg === 'start') {
    pullIntervalId = setInterval(osuIsRuning, 15000);
  }
});

process.once('SIGTERM', () => {
  process.removeAllListeners();
  if (pullIntervalId) clearInterval(pullIntervalId);
});

module.exports = {
  osuIsRuning,
};
