import { ipcRenderer } from 'electron';

export const getOsPath = name => ipcRenderer.sendSync('get-os-path', name);

export const getVersion = () => ipcRenderer.sendSync('get-version');
