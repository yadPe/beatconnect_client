const { ipcMain } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');

ipcMain.on('osuSongsScan', (event, options) => {
  const osuSongsScanProcess = fork(join(__dirname, './helpers/osuSongsScan.js'));
  osuSongsScanProcess.send(JSON.stringify({ msg: 'start', ...options }));
  osuSongsScanProcess.on('message', msg => {
    const { results, status, err } = JSON.parse(msg);
    if (results) event.reply('osuSongsScanResults', results);
    if (status) event.reply('osuSongsScanStatus', status);
    if (err) event.reply('osuSongsScanError', err);
  });
});

// ipcMain.on('')
