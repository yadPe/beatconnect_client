/* eslint-disable import/prefer-default-export */
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';

import channels from './channels';

const registerListener = (channel, callBack) => {
  if (callBack) ipcRenderer.on(channel, (_event, args) => callBack(args));
};
const unregisterListerner = (channel, callBack) => {
  if (callBack) ipcRenderer.removeListener(channel, (_event, args) => callBack(args));
};

export const useDownloadMangerIPC = ({
  onDownloadProgress,
  onDownloadPaused,
  onDownloadInterupt,
  onDownloadCanceled,
  onDownloadSucceed,
  onDownloadFail,
  onQueueUpdate,
  onDownloadManagerReady,
}) => {
  useEffect(() => {
    onDownloadManagerReady();
    registerListener(channels.downloadProgress, onDownloadProgress);
    registerListener(channels.downloadPaused, onDownloadPaused);
    registerListener(channels.downloadInterrupt, onDownloadInterupt);
    registerListener(channels.downloadCanceled, onDownloadCanceled);
    registerListener(channels.downloadSucceed, onDownloadSucceed);
    registerListener(channels.downloadFail, onDownloadFail);
    registerListener(channels.queueUpdated, onQueueUpdate);
    ipcRenderer.once(channels.ready, (_event, args) => onDownloadManagerReady(args));
    return () => {
      unregisterListerner(channels.downloadProgress, onDownloadProgress);
      unregisterListerner(channels.downloadPaused, onDownloadPaused);
      unregisterListerner(channels.downloadInterrupt, onDownloadInterupt);
      unregisterListerner(channels.downloadCanceled, onDownloadCanceled);
      unregisterListerner(channels.downloadSucceed, onDownloadSucceed);
      unregisterListerner(channels.downloadFail, onDownloadFail);
      unregisterListerner(channels.queueUpdated, onQueueUpdate);
      ipcRenderer.removeListener(channels.ready, (_event, args) => onDownloadManagerReady(args));
    };
  }, []);
};
