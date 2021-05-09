const log = require('electron-log');
const { error } = require('electron-log');
const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs').promises;
const { join } = require('path');
const { downloadAndSetWallpaper } = require('./wallpaper');
const { readCollectionDB } = require('./helpers/osuCollections/collections.utils');
const startPullingOsuState = require('./threads/osuIsRunning');
const scanOsuDb = require('./threads/osuSongsScan');

ipcMain.handle('osuSongsScan', async (event, { osuPath }) => {
  try {
    const [beatmaps, overallDuration, overallUnplayedCount] = await scanOsuDb(`${osuPath}/osu!.db`);
    return { beatmaps, overallDuration, overallUnplayedCount };
  } catch (e) {
    error(`[scan-osu-songs]: ${e.message}`);
    throw e;
  }
});

ipcMain.on('set-wallpaper', (event, bgUri) => {
  downloadAndSetWallpaper(bgUri)
    .then(() => event.reply('set-wallpaper-response', true))
    .catch(e => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Wallpaper',
        message: `Failed to change desktop wallaper\n ${e.message}`,
        detail: e.message,
      });
      event.reply('set-wallpaper-response', false);
      log.error(e.message);
      throw e;
    });
});

ipcMain.on('start-osu', (event, osuPath) => shell.openPath(join(osuPath, 'osu!.exe')).catch(error));

ipcMain.once('start-pulling-osu-state', event => {
  const osuStateHandler = isRunning => {
    event.reply('osu-is-running', isRunning);
  };
  startPullingOsuState(osuStateHandler);
});

ipcMain.handle('scan-osu-collections', async (event, osuPath) => {
  try {
    const collection = await readCollectionDB(`${osuPath}/collection.db`);
    return collection;
  } catch (e) {
    error(`[scan-osu-collections]: ${e.message}`);
    throw e;
  }
});

ipcMain.handle('validate-osu-path', async (event, osuPath) => {
  try {
    const isPathValid = await fs.stat(`${osuPath}/osu!.db`);
    isPathValid.isDirectory();
    return isPathValid.isFile();
  } catch {
    return false;
  }
});

ipcMain.handle('is-dir', async (event, path) => {
  try {
    const isPathValid = await fs.stat(path);
    return isPathValid.isDirectory();
  } catch {
    return false;
  }
});
