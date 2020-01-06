/* eslint-disable no-underscore-dangle */
const { lstatSync, existsSync } = require('fs');
const { ipcMain } = require('electron');

class BeatmapDownloader {
  constructor() {
    this.winRef = null;
    this.savePath = null;
    this.queue = new Set();
  }

  register(win) {
    this.winRef = win;
    this.winRef.webContents.session.on('will-download', this.onWillDownload.bind(this));
    ipcMain.on('download-beatmap', this.download);
  }

  setSavePath(path) {
    if (existsSync(path) && lstatSync(path).isDirectory()) this.savePath = path;
    else throw new Error('InvalidPath');
  }

  download(event, { beatmapSetId, uniqId }) {
    if (!this.savePath) throw new Error('noSavePath');
    const url = this._makeDownloadUrl({ beatmapSetId, uniqId });
    this.winRef.webContents.downloadURL(url);
  }

  onWillDownload(event, item, webContents) {
    item.setSavePath(this.savePath);

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Le téléchargement est interrompu mais peut être redémarrer');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Le téléchargement est en pause');
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Téléchargement réussi');
      } else {
        console.log(`Téléchargement échoué : ${state}`);
      }
    });
  }

  onStarted(item) {}

  onProgress({ percent, transferredBytes, totalBytes }) {}

  onCancel(item) {}

  onDone() {}

  _makeDownloadUrl = ({ beatmapSetId, uniqId }) => `https://beatconnect.io/b/${beatmapSetId}/${uniqId}/?nocf=1`;
}

module.exports = new BeatmapDownloader();
