import { ipcRenderer } from 'electron';
import channels from './channels';

const onDownloadProgress = callBack => ipcRenderer.on(channels.downloadProgress, (_event, args) => callBack(args));
const onDownloadPaused = callBack => ipcRenderer.on(channels.downloadPaused, (_event, args) => callBack(args));

export default {
  onDownloadProgress,
  onDownloadPaused,
};
