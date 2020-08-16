import { ipcRenderer } from 'electron';
import channels from './channels';

const sendToMain = ipcRenderer.send;

export const setSavePath = path => sendToMain(channels.setSavePath, path);
export const download = queueItem => sendToMain(channels.download, queueItem);
export const downloadMany = queueItems => sendToMain(channels.downloadMany, queueItems);
export const cancelCurrent = () => sendToMain(channels.cancelCurrentDownload);
export const pause = () => sendToMain(channels.pauseDownload);
export const pauseResume = () => sendToMain(channels.pauseResume);
export const cancel = beatmapSetId => sendToMain(channels.cancel, { beatmapSetId });
export const clearQueue = () => sendToMain(channels.clearQueue);
