const log = require('electron-log');
const { error } = require('electron-log');
const { ipcMain, dialog, shell, BrowserWindow } = require('electron');
const fs = require('fs').promises;
const { join } = require('path');
const { downloadAndSetWallpaper } = require('./wallpaper');
const { readCollectionDB } = require('./helpers/osuCollections/collections.utils');
const startPullingOsuState = require('./threads/osuIsRunning');
const scanOsuDb = require('./threads/osuSongsScan');
const { exists } = require('./helpers');

ipcMain.handle('osuSongsScan', async (event, { osuPath, isLazer }) => {
  try {
    const [beatmaps, overallDuration, overallUnplayedCount] = await scanOsuDb(osuPath, isLazer);
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

    // const test = await readCollectionDB(`${osuPath}/collection.db`);

    // console.log('READ : ', test);
    // test.push([
    //   'Top KEK',
    //   ['DABBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', 'OMEGAROBDAB', 'SAMARCH', '44444444444444444444444444444449'],
    // ]);

    // await writeCollectionDB(`${osuPath}/collection.db`, test);

    return collection;
  } catch (e) {
    error(`[scan-osu-collections]: ${e.message}`);
    throw e;
  }
});

ipcMain.handle('validate-osu-path', async (event, osuPath) => {
  const isPathValid = await exists(osuPath, 'collection.db');
  if (isPathValid) {
    const isLegacyOsu = await exists(osuPath, 'osu!.db');

    const isLazer = await exists(osuPath, 'client.realm');
    return { isValid: isLegacyOsu || isLazer, isLazer };
  }
  return { isValid: false, isLazer: false };
});

ipcMain.handle('is-dir', async (event, path) => {
  try {
    const isPathValid = await fs.stat(path);
    return isPathValid.isDirectory();
  } catch {
    return false;
  }
});

ipcMain.handle('dialog', (event, method, params) => dialog[method](params));

ipcMain.on('MINIMIZE_WINDOW', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.minimize();
  }
});

ipcMain.on('MAXIMIZE_WINDOW', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    if (window.isMaximized()) window.unmaximize();
    else window.maximize();
  }
});

ipcMain.on('CLOSE_WINDOW', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.close();
  }
});
