const { lstatSync, existsSync } = require('fs');
const { normalize, join } = require('path');
const { ipcMain } = require('electron');
const { performance } = require('perf_hooks');
const { makeDownloadUrl, readableBits } = require('./helpers');

// BeatmapDownloader register to the app window
// It handles all beatmaps downloads and provide a queue system for them,
// it is interfaced with the renderer thread via ipc channels
// and listen to the will-download session event to know when we want to download a something.

/* eslint-disable class-methods-use-this */

class BeatmapDownloader {
  constructor() {
    this.winRef = null;
    this.savePath = null;
    this.queue = new Set();
    this.setSavePath('C:/Users/AssAs/Downloads');
    console.log('downloadSpeed', readableBits(1024000));
  }

  register = win => {
    this.winRef = win;
    this.winRef.webContents.session.on('will-download', this.onWillDownload.bind(this));
    ipcMain.on('download-beatmap', (_event, args) => this.download(args));
    ipcMain.on('cancel-current-download', this.cancelCurrent);
    ipcMain.on('pause-current-download', this.pauseCurrent);
    ipcMain.on('cancel-download', (_event, beatmapSetId) => this.cancel(beatmapSetId));
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

  cancelCurrent = () => {};

  pauseCurrent = () => {};

  cancel = () => {};

  onWillDownload(event, item, webContents) {
    item.setSavePath(join(this.savePath, item.getFilename()));
    const beatmapsetId = item.getURLChain()[0].split('/')[4];

    item.on('updated', (_event, state) => {
      switch (state) {
        case 'interrupted':
          this.onInterrupted(item, beatmapsetId);
          break;
        case 'progressing':
          this.onProgress(item, beatmapsetId, webContents);
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
        case 'cancelled':
          this.onCancel(item, beatmapsetId);
          break;
        default:
          this.onFailed(item, state, beatmapsetId);
          break;
      }
    });
  }

  onProgress(item, beatmapsetId, webContents) {
    if (item.isPaused()) {
      console.log('Le téléchargement est en pause');
      webContents.send('download-paused', { beatmapsetId });
    } else {
      const receivedBytes = item.getReceivedBytes();
      const bytesPerSecond =
        (receivedBytes - (this.lastReceivedBytes || 0)) / ((performance.now() - (this.lastProgress || 0)) * 1000);

      this.lastProgress = performance.now();
      this.lastReceivedBytes = receivedBytes;
      const progressPercent = ((receivedBytes / item.getTotalBytes()) * 100).toFixed(2);
      const downloadSpeed = readableBits(bytesPerSecond);
      webContents.send('download-progress', { beatmapsetId, progressPercent, downloadSpeed });
      console.log('speed', bytesPerSecond);
      console.log('downloadSpeed', downloadSpeed);
      console.log('progressPercent', progressPercent);
    }
  }

  onInterrupted(item, beatmapsetId) {
    console.log('Le téléchargement est interrompu mais peut être redémarrer');
  }

  onCancel(item, beatmapsetId) {
    console.log('Telechargement anunlé');
  }

  onDone(item, beatmapsetId) {
    console.log('Téléchargement réussi');
  }

  onFailed(item, state, beatmapsetId) {
    console.log(`Téléchargement échoué : ${state}`);
  }
}

module.exports = new BeatmapDownloader();
