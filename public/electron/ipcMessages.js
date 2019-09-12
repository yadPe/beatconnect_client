const { ipcMain } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');

ipcMain.on('osuSongsScan', (event, osuDir) => {
  const osuSongsScan = fork(join(__dirname, '../../src/helpers/osuSongsScan.js'));
  osuSongsScan.send(JSON.stringify({ msg: 'start', osuDir }));
  osuSongsScan.on('message', msg => {
    const { results, status } = JSON.parse(msg)
    if (results) event.reply('osuSongsScanResults', results)
    if (status) event.reply('osuSongsScanStatus', status)
  })
})