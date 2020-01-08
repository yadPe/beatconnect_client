/* eslint-disable class-methods-use-this */
const { lstatSync, existsSync } = require('fs');
const { normalize, join } = require('path');
const { ipcMain } = require('electron');

const makeDownloadUrl = ({ beatmapSetId, uniqId }) => `https://beatconnect.io/b/${beatmapSetId}/${uniqId}/?nocf=1`;

class BeatmapDownloader {
  constructor() {
    this.winRef = null;
    this.savePath = null;
    this.queue = new Set();
    this.setSavePath('C:/Users/AssAs/Downloads');
  }

  register = win => {
    this.winRef = win;
    this.winRef.webContents.session.on('will-download', this.onWillDownload.bind(this));
    ipcMain.on('download-beatmap', (_event, args) => this.download(args));
    ipcMain.on('set-beatmap-save-folder', (_event, path) => this.setSavePath(path));
  };

  setSavePath = path => {
    const validPath = normalize(path);
    if (existsSync(validPath) && lstatSync(validPath).isDirectory()) this.savePath = validPath;
    else throw new Error('InvalidPath');
  };

  download = ({ beatmapSetId, uniqId }) => {
    if (!this.savePath) throw new Error('noSavePath');
    console.log('download', beatmapSetId);
    const url = makeDownloadUrl({ beatmapSetId, uniqId });
    this.winRef.webContents.downloadURL(url);
  };

  onWillDownload(event, item, webContents) {
    item.setSavePath(join(this.savePath, item.getFilename()));
    const beatmapsetId = item.getURLChain()[0].split('/')[4];

    item.on('updated', (_event, state) => {
      switch (state) {
        case 'interrupted':
          this.onInterrupted(item, beatmapsetId);
          break;
        case 'progressing':
          this.onProgress(item, beatmapsetId);
          break;
        default:
          break;
      }
    });
    item.once('done', (_event, state) => {
      switch (state) {
        case 'completed':
          this.onDone(item, beatmapsetId);
          break;
        default:
          this.onFailed(item, state, beatmapsetId);
          break;
      }
    });
  }

  onStarted(item) {}

  onProgress(item, beatmapsetId) {
    if (item.isPaused()) {
      console.log('Le téléchargement est en pause');
    } else {
      console.log(`${beatmapsetId}: Received bytes: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`);
    }
  }

  onInterrupted(item) {
    console.log('Le téléchargement est interrompu mais peut être redémarrer');
  }

  onCancel(item) {}

  onDone(item) {
    console.log('Téléchargement réussi');
  }

  onFailed(item, state) {
    console.log(`Téléchargement échoué : ${state}`);
  }
}

module.exports = new BeatmapDownloader();
