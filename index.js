const Bot = require('./src/bot');
const fs = require('fs');
const electron = require('electron');
const { app, BrowserWindow } = electron;


let mainWindow, bot = null;
// try {
//   config = JSON.parse(fs.readFileSync('./conf.json'))
//   //console.log(config)

// } catch (err) {
//   console.error('Cannot find config File')
//   process.exit();
// }

// const bot = new Bot(config);

// https://electronjs.org/docs/api/browser-window
// https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/

app.on('ready', () => {
  
  try {
    config = JSON.parse(fs.readFileSync('./conf.json'))
    //console.log(config)

  } catch (err) {
    console.error('Cannot find config File')
    process.exit();
  }

  bot = new Bot(config);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#5b5956',
    opacity: 0.95,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('http://localhost:4000')

  mainWindow.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    mainWindow = null;
    bot = null;
    process.exit();
  })
})



