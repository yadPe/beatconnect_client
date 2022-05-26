const { ipcRenderer } = require('electron');

export const trackEvent = (category, action, label, value) => {
  ipcRenderer.invoke('trackEvent', category, action, label, value);
};

export const trackNavigation = sectionName => {
  ipcRenderer.invoke('trackNavigation', sectionName);
};
