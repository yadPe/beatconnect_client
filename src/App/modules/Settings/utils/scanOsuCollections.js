import { ipcRenderer } from 'electron';
import store from '../../../../shared/store';

export const scanOsuCollection = async osuPath => {
  const maybeCollections = await ipcRenderer.invoke('scan-osu-collections', osuPath);
  if (maybeCollections instanceof Error) {
    // eslint-disable-next-line no-alert
    alert(`Failed to scan osu collections ${maybeCollections.message}`);
    return {};
  }
  store.dispatch({ type: 'SET-OSU-COLLECTIONS', payload: maybeCollections });
  return maybeCollections;
};
