const { ipcMain } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');

ipcMain.on('osuSongsScan', (event, osuDir) => { 
  const osuSongsScan = fork(join(__dirname, '../../src/helpers/osuSongsScan.js'));
  osuSongsScan.send(JSON.stringify({msg: 'start', osuDir}));
  osuSongsScan.on('message', result => event.reply('osuSongsScanResults', result));
})