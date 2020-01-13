import { ipcRenderer } from 'electron';
import channels from './channels';

const registerListener = (channel, callBack) => ipcRenderer.on(channel, (_event, args) => callBack(args));

const onDownloadProgress = cb => registerListener(channels.downloadProgress, cb);
const onDownloadPaused = cb => registerListener(channels.downloadPaused, cb);
const onDownloadInterupt = cb => registerListener(channels.downloadInterrupt, cb);
const onDownloadCanceled = cb => registerListener(channels.downloadCanceled, cb);
const onDownloadSucceed = cb => registerListener(channels.downloadSucceed, cb);
const onDownloadFail = cb => registerListener(channels.downloadFail, cb);
const onQueueUpdate = cb => registerListener(channels.queueUpdated, cb);
