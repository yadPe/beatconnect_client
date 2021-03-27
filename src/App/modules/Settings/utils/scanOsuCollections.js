import { ipcRenderer } from 'electron';

export const scanOsuCollection = async osuPath => {
  const maybeCollections = await ipcRenderer.invoke('scan-osu-collections', osuPath);
  if (maybeCollections instanceof Error) {
    // eslint-disable-next-line no-alert
    alert(`Failed to scan osu collections ${maybeCollections.message}`);
    return {};
  }
  return maybeCollections;
};
