const { ipcMain, dialog } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');
const { downloadAndSetWallpaper } = require('./wallpaper');

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

ipcMain.on('set-wallpaper', (event, bgUri) => {
  downloadAndSetWallpaper(bgUri)
    .then(() => event.reply('set-wallpaper-response', true))
    .catch(e => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Wallpaper',
        message: `Failed to change desktop wallaper\n ${e.message}`,
      });
      event.reply('set-wallpaper-response', false);
    });
});
