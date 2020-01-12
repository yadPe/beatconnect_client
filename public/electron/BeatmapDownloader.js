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
    this.currentDownload = { item: null, beatmapSetInfos: null };
    this.queue = new Set();
    this.setSavePath('/Users/yannis/Downloads/');
    console.log('downloadSpeed', readableBits(1024000));
  }

  register = win => {
    if (this.winRef) return;
    this.winRef = win;
    this.sendToWin = args => win.webContents.send(args);
    console.log('sendToWin', this.sendToWin.toString());

    this.winRef.webContents.session.on('will-download', this.onWillDownload.bind(this));
    ipcMain.on('download-beatmap', (_event, args) => this.download(args));
    ipcMain.on('cancel-current-download', this.cancelCurrent);
    ipcMain.on('pause-resume-current-download', this.pauseResumeCurrent);
    ipcMain.on('cancel-download', (_event, beatmapSetId) => this.cancel(beatmapSetId));
    ipcMain.on('set-beatmap-save-folder', (_event, path) => this.setSavePath(path));
    ipcMain.on('clear-download-queue', this.clearQueue);
  };

  setSavePath(path) {
    const validPath = normalize(path);
    if (existsSync(validPath) && lstatSync(validPath).isDirectory()) this.savePath = validPath;
    else throw new Error('InvalidPath');
  }

  addToQueue(item) {
    this.queue.add(item);
    this.sendToWin('queue-updated', { queue: Array.from(this.queue) });
  }

  deleteFromQueue(item) {
    this.queue.delete(item);
    this.sendToWin('queue-updated', { queue: Array.from(this.queue) });
  }

  clearQueue = () => {
    this.queue.clear();
    this.sendToWin('queue-updated', { queue: Array.from(this.queue) });

    // clear the queue
  };

  setCurrentDownloadBeatmapInfos(beatmapSetInfos) {
    if (this.currentDownload.item) {
      const beatmapsetId = this.currentDownload.item.getURLChain()[0].split('/')[4];
      if (beatmapSetInfos.beatmapSetId !== beatmapsetId) {
        throw new Error('currentDownloadIdMissmatch');
      }
    }
    this.currentDownload.beatmapSetInfos = beatmapSetInfos;
  }

  setCurrentDownloadItem(item) {
    if (this.currentDownload.beatmapSetInfos) {
      const beatmapsetId = item.getURLChain()[0].split('/')[4];
      if (this.currentDownload.beatmapSetInfos.beatmapSetId !== beatmapsetId) {
        throw new Error('currentDownloadIdMissmatch');
      }
    }
    this.currentDownload.item = item;
  }

  clearCurrentDownload() {
    const downloadState = this.currentDownload.item && this.currentDownload.item.getState();
    if (downloadState === 'progressing' || downloadState === 'interrupted') {
      throw new Error('downloadNotStopped');
    }
    this.deleteFromQueue(this.currentDownload.beatmapSetInfos);
    this.currentDownload = { item: null, beatmapSetInfos: null };
  }

  pushToQueue({ beatmapSetId, uniqId, beatmapSetInfos }) {
    if (!this.savePath) throw new Error('noSavePath');
    this.addToQueue({ beatmapSetId, uniqId, beatmapSetInfos });
    this.executeQueue();
  }

  cancelCurrent = () => {
    // cancel the current download
    if (!this.currentDownload.item) throw new Error('noCurrentDownloadItem');
    this.currentDownload.item.cancel();
  };

  pauseResumeCurrent = () => {
    // pause or resume the current download based on its state
    const item = this.currentDownload;
    if (!item) throw new Error('noCurrentDownloadItem');
    if (item.isPaused()) item.resume();
    else item.pause();
  };

  cancel = id => {
    // check if id is current download and cancel it
    // or look for this id in the queue and removes it
    const item = Array.from(this.queue).find(({ beatmapSetId }) => beatmapSetId === id);
    this.deleteFromQueue(item);
  };

  download({ beatmapSetId, uniqId, beatmapSetInfos }) {
    const url = makeDownloadUrl({ beatmapSetId, uniqId });
    this.winRef.webContents.downloadURL(url);
    this.setCurrentDownloadBeatmapInfos({ beatmapSetId, uniqId, beatmapSetInfos });
  }

  executeQueue() {
    if (this.currentDownload.item || this.currentDownload.beatmapSetInfos) return;
    const [item] = this.queue;
    this.download(item);
  }

  onWillDownload(event, item, webContents) {
    this.setCurrentDownloadItem(item);
    item.setSavePath(join(this.savePath, item.getFilename()));
    const beatmapsetId = this.currentDownload.beatmapSetInfos.id || item.getURLChain()[0].split('/')[4];

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
      this.sendToWin('download-paused', { beatmapsetId });
    } else {
      const receivedBytes = item.getReceivedBytes();
      const bytesPerSecond =
        (receivedBytes - (this.lastReceivedBytes || 0)) / ((performance.now() - (this.lastProgress || 0)) * 1000);

      this.lastProgress = performance.now();
      this.lastReceivedBytes = receivedBytes;
      const progressPercent = ((receivedBytes / item.getTotalBytes()) * 100).toFixed(2);
      const downloadSpeed = readableBits(bytesPerSecond);
      this.sendToWin('download-progress', { beatmapsetId, progressPercent, downloadSpeed });
      console.log(this.currentDownload);
      console.log('QUEUE::::::::::::', this.queue.size);

      // console.log('speed', bytesPerSecond);
      // console.log('downloadSpeed', downloadSpeed);
      // console.log('progressPercent', progressPercent);
    }
  }

  onInterrupted(item, beatmapsetId, webContents) {
    console.log('Le téléchargement est interrompu mais peut être redémarrer');
  }

  onCancel(item, beatmapsetId, webContents) {
    console.log('Telechargement anunlé');
    this.clearCurrentDownload();
    this.executeQueue();
  }

  onDone(item, beatmapsetId, webContents) {
    console.log('Téléchargement réussi');
    this.clearCurrentDownload();
    this.executeQueue();
  }

  onFailed(item, state, beatmapsetId, webContents) {
    console.log(`Téléchargement échoué : ${state}`);
    this.clearCurrentDownload();
    this.executeQueue();
  }
}

module.exports = new BeatmapDownloader();
