const { shell } = require('electron');
const { join } = require('path');
const { lookup } = require('ps-node');

const launchOsu = osuPath => shell.openItem(join(osuPath, 'osu!.exe'));

const osuIsRuning = () => {
  lookup(
    {
      command: 'node',
      arguments: '--debug',
    },
    function(err, resultList) {
      if (err) {
        throw new Error(err);
      }

      resultList.forEach(function(process) {
        if (process) {
          console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
        }
      });
    },
  );
};

module.exports = {
  launchOsu,
  osuIsRuning,
};
