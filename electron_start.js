const Bot = require('./src/Bot');
const fs = require('fs');
const electron = require('electron');
const { app } = electron;
const Window = require('./electron/Window');
const path = require('path')
const url = require('url')




// try {
//   config = JSON.parse(fs.readFileSync('./conf.json'))
//   //console.log(config)

// } catch (err) {
//   console.error('Cannot find config File')
//   process.exit();
// }

// const bot = new Bot(config);

// https://codeburst.io/build-a-todo-app-with-electron-d6c61f58b55a
// https://electronjs.org/docs/api/browser-window
// https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/
// https://medium.com/@brockhoff/using-electron-with-react-the-basics-e93f9761f86f


const main = () => {
  let mainWindow, bot = null;
  console.log('readee')

  // try {
  //   config = JSON.parse(fs.readFileSync('./conf.json'));
  // } catch (err) {
  //   console.error('Cannot find config File');
  //   process.exit();
  // }
  // bot = new Bot(config);

  mainWindow = new Window({
    backgroundColor: '#5b5956',
    //opacity: 0.95,
    webPreferences: {
      nodeIntegration: true
    },
    url: process.env.ELECTRON_START_URL || url.format({
      //pathname: path.join(__dirname, '/src/web/index.html'),
      pathname: path.join(__dirname, '/build/index.html'),
      protocol: 'file:',
      slashes: true
    })
  });
  //mainWindow.loadURL('http://localhost:4000');

  mainWindow.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    mainWindow = null;
    bot = null;
  });
}

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
  process.exit();
});
