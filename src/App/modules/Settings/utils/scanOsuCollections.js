import { ipcRenderer } from 'electron';
import store from '../../../../shared/store';

export const scanOsuCollection = async osuPath => {
  if (!osuPath) return undefined;
  try {
    const maybeCollections = await ipcRenderer.invoke('scan-osu-collections', osuPath);
    store.dispatch({ type: 'SET-OSU-COLLECTIONS', payload: maybeCollections });
    return maybeCollections;
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert(`Failed to scan osu collections ${e.message}`);
    return {};
  }
};
