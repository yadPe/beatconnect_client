const electron = require('electron');
const { app } = electron;
const Window = require('./Window');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
require('update-electron-app')()

const DownloadManager = require("electron-download-manager");

DownloadManager.register({
  downloadFolder: app.getPath("downloads") + "/beatconnect"
});


// https://codeburst.io/build-a-todo-app-with-electron-d6c61f58b55a
// https://electronjs.org/docs/api/browser-window
// https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/
// https://medium.com/@brockhoff/using-electron-with-react-the-basics-e93f9761f86f


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
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    }) :
      url.format({
        pathname: path.join(__dirname, './index.html'),
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
