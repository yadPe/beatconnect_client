const { BrowserWindow } = require('electron');
const path = require('path');

// default window settings
const defaultProps = {
  icon: path.join(__dirname, '../icon.png'),
  width: 1200,
  height: 750,
  minHeight: 350,
  minWidth: 890,
  show: false,
  darkTheme: true,
  // eslint-disable-next-line no-unneeded-ternary
  frame: process.env.ELECTRON_START_URL ? true : false,
};

class Window extends BrowserWindow {
  constructor({ url, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings });

    this.loadURL(url);

    this.once('ready-to-show', () => {
      this.show();
    });
  }
}

module.exports = Window;
