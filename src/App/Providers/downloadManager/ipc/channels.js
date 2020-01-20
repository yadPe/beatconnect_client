const ipcChannels = {
  ready: 'ready',
  setSavePath: 'set-beatmap-save-folder',
  cancel: 'cancel-download',
  pauseDownload: 'pause-current-download',
  cancelCurrentDownload: 'cancel-current-download',
  download: 'download-beatmap',
  pauseResume: 'pause-resume-current-download',
  clearQueue: 'clear-download-queue',
  queueUpdated: 'queue-updated',
  downloadProgress: 'download-progress',
  downloadPaused: 'download-paused',
  downloadInterrupt: 'download-interrupted',
  downloadCanceled: 'download-canceled',
  downloadSucceed: 'download-succeeded',
  downloadFail: 'download-failed',
};

export default ipcChannels;
