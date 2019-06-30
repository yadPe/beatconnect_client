const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  width: 800,
  height: 500,
  show: false,
  darkTheme: true,
  //frame: false
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)
    // this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering

    // this.on('will-move', (e) => this.setOpacity(0.75))
    // this.on('moved', () => this.setOpacity(windowSettings.opacity || 1))

    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window