const { ipcMain, dialog, shell } = require('electron');
const { join } = require('path');
const { fork } = require('child_process');
const { downloadAndSetWallpaper } = require('./wallpaper');

ipcMain.on('osuSongsScan', (event, options) => {
  // TODO Replace with osu-db-parser module
  const osuSongsScanProcess = fork(join(__dirname, './processes/osuSongsScan.js'));
  osuSongsScanProcess.stdout.pipe(process.stdout);
  osuSongsScanProcess.send(JSON.stringify({ msg: 'start', ...options }));
  osuSongsScanProcess.on('message', msg => {
    const { results, status, err } = JSON.parse(msg);
    if (results) {
      event.reply('osuSongsScanResults', results);
      osuSongsScanProcess.kill('SIGTERM');
    }
    if (status) event.reply('osuSongsScanStatus', status);
    if (err) {
      event.reply('osuSongsScanError', err);
      osuSongsScanProcess.kill('SIGTERM');
    }
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

ipcMain.on('start-osu', (event, osuPath) => shell.openItem(join(osuPath, 'osu!.exe')));

ipcMain.once('start-pulling-osu-state', event => {
  const osuIsRunningChecker = fork(join(__dirname, './processes/osuIsRunning.js'));
  osuIsRunningChecker.on('message', msg => {
    event.reply('osu-is-running', !!msg);
  });
  osuIsRunningChecker.send('start');
});

// try {
//   const osuSongsScanProcess = fork(join(__dirname, './processes/osuSongsScan.js'));
//   osuSongsScanProcess.stdout.pipe(process.stdout);
// } catch (e) {
//   console.error(e);
// }
