/* eslint-disable no-console */
const { app, webContents, dialog } = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const makeMainWindow = require('./MainWindow');
require('./ipcMessages');
const { makeTracker } = require('./analytics');

log.transports.file.level = 'debug';
autoUpdater.logger = log;
autoUpdater.on('checking-for-update', () => {
  webContents.getFocusedWebContents().send('autoUpdater', { status: 'checkingUpdate' });
});
autoUpdater.on('update-available', () => {
  webContents.getFocusedWebContents().send('autoUpdater', { status: 'updateAvailable' });
});
autoUpdater.on('update-downloaded', ({ releaseName }) => {
  webContents.getFocusedWebContents().send('autoUpdater', { status: 'updateDownloaded', releaseName });
});
autoUpdater.on('update-not-available', () => {
  webContents.getFocusedWebContents().send('autoUpdater', { status: 'noUpdateAvailable' });
});

const main = () => {
  if (isDev) {
    console.log('Main process ready');
    console.log('Waiting for dev server to show up');
  }

  let mainWindow = null;
  const { trackEvent, trackNavigation } = makeTracker();
  global.tracking = { trackEvent, trackNavigation };

  // mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow = makeMainWindow({
    url: isDev
      ? process.env.ELECTRON_START_URL ||
        url.format({
          pathname: path.join(__dirname, '../../build/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      : url.format({
          pathname: path.join(__dirname, './build/index.html'),
          protocol: 'file:',
          slashes: true,
        }),
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
