const Bot = require('./src/bot');
const fs = require('fs');
const electron = require('electron');
const { app } = electron;
const Window = require('./electron/Window');
const path = require('path')




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


const main = () => {
  let mainWindow, bot = null;

  try {
    config = JSON.parse(fs.readFileSync('./conf.json'));
  } catch (err) {
    console.error('Cannot find config File');
    process.exit();
  }
  //bot = new Bot(config);

  mainWindow = new Window({
    backgroundColor: '#5b5956',
    //opacity: 0.95,
    webPreferences: {
      nodeIntegration: true
    },
    file: path.join('src/web', 'index.html')
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
