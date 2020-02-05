const { BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require('electron-updater');
const { join } = require('path');
const beatmapDownloader = require('./BeatmapDownloader');
const isDev = require('electron-is-dev');

const makeMainWindowSettings = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800,
  });

  // default window settings
  return [
    mainWindowState,
    {
      icon: join(__dirname, '../icon.png'),
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      minHeight: 350,
      minWidth: 890,
      show: false,
      darkTheme: true,
      // eslint-disable-next-line no-unneeded-ternary
      frame: process.env.ELECTRON_START_URL ? true : false,
      backgroundColor: '#121212',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    },
  ];
};

const makeMainWindow = ({ url, ...options }) => {
  const [mainWindowState, defaultOptions] = makeMainWindowSettings();
  const mainWindow = new BrowserWindow({ ...defaultOptions, ...options });
  mainWindow
    .once('ready-to-show', () => {
      mainWindow.show();
      beatmapDownloader.register(mainWindow);
      mainWindowState.manage(mainWindow);
      if (isDev) mainWindow.webContents.openDevTools();
    })
    .on('show', () => {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 5000);
    })
    .loadURL(url);
  return mainWindow;
};

module.exports = makeMainWindow;
