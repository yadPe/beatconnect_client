const { app } = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const DownloadManager = require("electron-download-manager");
const Window = require('./Window');
const path = require('path');
const url = require('url');
require('./ipcMessages');

log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.on('update-available', () => {
  // TODO send ipc message to render to show that an update is being downloaded in bg
})
autoUpdater.checkForUpdatesAndNotify()
DownloadManager.register({
  downloadFolder: app.getPath("downloads") + "/beatconnect"
});

const main = () => {
  let mainWindow = null;
  console.log('readee')

  mainWindow = new Window({
    backgroundColor: '#121212',
    //opacity: 0.95,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    url: isDev ? process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '../../build/index.html'),
      protocol: 'file:',
      slashes: true
    }) :
      url.format({
        pathname: path.join(__dirname, '.././index.html'),
        protocol: 'file:',
        slashes: true
      })
  });

  mainWindow.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    mainWindow = null;
  });
}

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
