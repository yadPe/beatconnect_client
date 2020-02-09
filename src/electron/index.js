/* eslint-disable no-console */
const { app } = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const makeMainWindow = require('./MainWindow');
require('./ipcMessages');
const { makeTracker } = require('./analytics');

log.transports.file.level = 'debug';
autoUpdater.logger = log;

const main = () => {
  if (isDev) {
    console.log('Main process ready');
    console.log('Waiting for dev server to show up');
  }

  let mainWindow = null;
  mainWindow = makeMainWindow({
    url:
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: './build/index.html',
        protocol: 'file:',
        slashes: true,
      }),
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const { trackEvent, trackNavigation } = makeTracker(mainWindow.webContents.session.getUserAgent());
  global.tracking = { trackEvent, trackNavigation };

  const sendToMainWindow = mainWindow.webContents.send;
  autoUpdater.on('checking-for-update', () => {
    sendToMainWindow('autoUpdater', { status: 'checkingUpdate' });
  });
  autoUpdater.on('update-available', () => {
    sendToMainWindow('autoUpdater', { status: 'updateAvailable' });
  });
  autoUpdater.on('update-downloaded', ({ releaseName }) => {
    sendToMainWindow('autoUpdater', { status: 'updateDownloaded', releaseName });
  });
  autoUpdater.on('update-not-available', () => {
    sendToMainWindow('autoUpdater', { status: 'noUpdateAvailable' });
  });
};

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
