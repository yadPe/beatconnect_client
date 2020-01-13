import { ipcRenderer } from 'electron';
import channels from './channels';

const registerListener = (channel, callBack) => ipcRenderer.on(channel, (_event, args) => callBack(args));

export const onDownloadProgress = cb => registerListener(channels.downloadProgress, cb);
export const onDownloadPaused = cb => registerListener(channels.downloadPaused, cb);
export const onDownloadInterupt = cb => registerListener(channels.downloadInterrupt, cb);
export const onDownloadCanceled = cb => registerListener(channels.downloadCanceled, cb);
export const onDownloadSucceed = cb => registerListener(channels.downloadSucceed, cb);
export const onDownloadFail = cb => registerListener(channels.downloadFail, cb);
export const onQueueUpdate = cb => registerListener(channels.queueUpdated, cb);
