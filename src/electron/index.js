/* eslint-disable no-console */
const { app } = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { join } = require('path');

const makeMainWindow = require('./MainWindow');
const { makeTracker } = require('./analytics');
require('./ipcMessages');

log.transports.file.level = 'debug';
autoUpdater.logger = log;

const main = () => {
  if (isDev) {
    console.log('Main process ready');
    console.log('Waiting for dev server to show up');
  }

  let mainWindow = null;
  mainWindow = makeMainWindow({
    content: join(__dirname, 'index.html'),
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const { trackEvent, trackNavigation } = makeTracker(mainWindow.webContents.session.getUserAgent());
  global.tracking = { trackEvent, trackNavigation };

  autoUpdater.on('checking-for-update', () => {
    try {
      mainWindow.webContents.send('autoUpdater', { status: 'checkingUpdate' });
    } catch (e) {
      log.error(e);
    }
  });
  autoUpdater.on('update-available', ({ info }) => {
    try {
      mainWindow.webContents.send('autoUpdater', { status: 'updateAvailable', info });
    } catch (e) {
      log.error(e);
    }
  });
  autoUpdater.on('update-downloaded', ({ releaseName }) => {
    try {
      mainWindow.webContents.send('autoUpdater', { status: 'updateDownloaded', info: { releaseName } });
    } catch (e) {
      log.error(e);
    }
  });
  autoUpdater.on('update-not-available', () => {
    try {
      mainWindow.webContents.send('autoUpdater', { status: 'noUpdateAvailable' });
    } catch (e) {
      log.error(e);
    }
  });
  autoUpdater.on('download-progress', ({ percent }) => {
    try {
      mainWindow.webContents.send('autoUpdater', { status: 'updateDownloadProgress', info: { percent } });
    } catch (e) {
      log.error(e);
    }
  });
};

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
