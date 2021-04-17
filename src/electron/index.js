/* eslint-disable no-console */
const { app, protocol } = require('electron');
const log = require('electron-log');
const { warn } = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { join } = require('path');
const { default: extensionInstaller, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const makeMainWindow = require('./MainWindow');
const { makeTracker } = require('./analytics');
const { getBeatconnectProtocolParams } = require('./helpers');
require('./ipcMessages');

log.transports.file.level = 'debug';
autoUpdater.logger = log;

const installExtensions = async extensions => {
  return Promise.all(
    extensions.map(extension =>
      extensionInstaller(extension)
        .then(name => console.log(`[extensionInstaller]: Installed ${name}!`))
        .catch(err => console.log('[extensionInstaller]: An error occurred: ', err)),
    ),
  );
};

const CUSTOM_PROTOCOL = 'beatconnect';

let mainWindow = null;
const main = async () => {
  if (isDev) {
    // Makes local file access work when using dev server
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });
    console.log('Loading extensions..');
    await installExtensions([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
    console.log('Main process ready');
    console.log('Waiting for dev server to show up');
  }

  mainWindow = makeMainWindow({
    content: join(__dirname, 'index.html'),
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // init ga tracking and set tracking methods on global
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

const isMainInstance = app.requestSingleInstanceLock();

if (isMainInstance || isDev) {
  app.on('open-url', (event, data) => {
    event.preventDefault();
    // TODO: handle osx and linux ?
    // TODO: Send data to renderer
    // mainWindow.webContents.send('beatconnect-open', data)
    console.log('Protocol called:', data);
  });

  if (!isDev) {
    app.removeAsDefaultProtocolClient(CUSTOM_PROTOCOL);
    const ok = app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
    if (!ok) warn('Failed to set default protocol: beatconnect');
  }

  app.on('second-instance', (event, argv) => {
    const protocolArgs = getBeatconnectProtocolParams(argv, CUSTOM_PROTOCOL);
    if (protocolArgs) mainWindow.webContents.send('beatconnect-open', protocolArgs);
    // Someone tried to run a second instance, we should focus the main window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('ready', main);
  app.on('window-all-closed', () => {
    app.quit();
  });
} else {
  app.quit();
}
