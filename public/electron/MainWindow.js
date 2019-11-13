const { BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require('electron-updater');
const { join } = require('path');

const getMainWindowSettings = () => {
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
      frame: process.env.ELECTRON_START_URL ? true : false,
      backgroundColor: '#121212',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    },
  ];
};

class MainWindow extends BrowserWindow {
  constructor({ url, ...windowSettings }) {
    const [mainWindowState, settings] = getMainWindowSettings();
    // calls new BrowserWindow with these props
    super({ ...settings, ...windowSettings });

    this.loadURL(url);

    this.once('ready-to-show', () => {
      this.show();
    });

    this.on('show', () => {
      mainWindowState.manage(this);
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 5000);
    });
  }
}

module.exports = MainWindow;
