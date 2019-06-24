const Bot = require('./src/bot');
const fs = require('fs');
const electron = require('electron');
const { app, BrowserWindow } = electron;


// let mainWindow, config = null;
// try {
//   config = JSON.parse(fs.readFileSync('./conf.json'))
//   //console.log(config)

// } catch (err) {
//   console.error('Cannot find config File')
//   process.exit();
// }

// const bot = new Bot(config);

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
})


win.on('closed', () => {
  // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
  // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
  // où vous devez supprimer l'élément correspondant.
  mainWindow = null
})
