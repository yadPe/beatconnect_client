/* eslint-disable no-console */
const { app, webContents } = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const MainWindow = require('./MainWindow');
require('./ipcMessages');

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
  let mainWindow = null;
  if (isDev) {
    console.log('Main process ready');
    console.log('Waiting for dev server to show up');
  }

  mainWindow = new MainWindow({
    url: isDev
      ? process.env.ELECTRON_START_URL ||
        url.format({
          pathname: path.join(__dirname, '../../build/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      : url.format({
          pathname: path.join(__dirname, '../index.html'),
          protocol: 'file:',
          slashes: true,
        }),
  });

  mainWindow.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    mainWindow = null;
  });
};

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
