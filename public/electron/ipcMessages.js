const { ipcMain } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');

ipcMain.on('osuSongsScan', (event, options) => {
  const osuSongsScan = fork(join(__dirname, '../../src/helpers/osuSongsScan.js'));
  osuSongsScan.send(JSON.stringify({ msg: 'start', ...options }));
  osuSongsScan.on('message', msg => {
    const { results, status, err } = JSON.parse(msg)
    if (results) event.reply('osuSongsScanResults', results)
    if (status) event.reply('osuSongsScanStatus', status)
    if (err) event.reply('osuSongsScanError', err)
  })
})