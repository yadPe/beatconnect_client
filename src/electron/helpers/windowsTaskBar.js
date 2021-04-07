/* eslint-disable no-underscore-dangle */
const { ipcMain, nativeImage } = require('electron');
const path = require('path');

class WindowsTaskBar {
  static IPC_CHANNELS = Object.freeze({
    EXEC_PLAY_PAUSE: 'EXEC_PLAY_PAUSE',
    EXEC_PREV: 'EXEC_PREV',
    EXEC_NEXT: 'EXEC_NEXT',
    UPDATE_THUMB_BAR: 'UPDATE_THUMB_BAR',
    UPDATE_PLAY_STATE: 'UPDATE_PLAY_STATE',
  });

  constructor() {
    this.browserWindow = null;
    this.icons = {
      next: nativeImage.createFromPath(path.join(__dirname, 'next.png')),
      prev: nativeImage.createFromPath(path.join(__dirname, 'previous.png')),
      play: nativeImage.createFromPath(path.join(__dirname, 'play.png')),
      pause: nativeImage.createFromPath(path.join(__dirname, 'pause.png')),
    };
  }

  _sendNext() {
    this.browserWindow.webContents.send(WindowsTaskBar.IPC_CHANNELS.EXEC_NEXT);
  }

  _sendPlayPause() {
    this.browserWindow.webContents.send(WindowsTaskBar.IPC_CHANNELS.EXEC_PLAY_PAUSE);
  }

  _sendPrevious() {
    this.browserWindow.webContents.send(WindowsTaskBar.IPC_CHANNELS.EXEC_PREV);
  }

  _updateThumbarButtons(isPlaying, canPlayNext, canPlayPrev) {
    this.browserWindow.setThumbarButtons([
      {
        icon: this.icons.prev,
        flags: ['nobackground', ...(canPlayPrev ? [] : ['disabled', 'hidden'])],
        click: this._sendPrevious.bind(this),
      },
      {
        icon: isPlaying ? this.icons.pause : this.icons.play,
        flags: ['nobackground'],
        click: this._sendPlayPause.bind(this),
      },
      {
        icon: this.icons.next,
        flags: ['nobackground', ...(canPlayNext ? [] : ['disabled', 'hidden'])],
        click: this._sendNext.bind(this),
      },
    ]);
  }

  register(browserWindow) {
    this.browserWindow = browserWindow;
    ipcMain.on(WindowsTaskBar.IPC_CHANNELS.UPDATE_THUMB_BAR, (event, { isPlaying, canPlayNext, canPlayPrev }) => {
      this._updateThumbarButtons(isPlaying, canPlayNext, canPlayPrev);
    });
  }
}

const windowsTaskBar = new WindowsTaskBar();

module.exports = windowsTaskBar;
