const ipcChannels = {
  setSavePath: 'set-beatmap-save-folder',
  cancel: 'cancel-download',
  pauseDownload: 'pause-current-download',
  cancelCurrentDownload: 'cancel-current-download',
  download: 'download-beatmap',
  downloadProgress: 'download-progress',
  downloadPaused: 'download-paused',
  pauseResume: 'pause-resume-current-download',
  clearQueue: 'clear-download-queue',
};

export default ipcChannels;
