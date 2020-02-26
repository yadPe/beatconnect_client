import { ipcRenderer } from 'electron';

import store from '../../../../shared/store';

export const onBeatmapSearchResult = searchResults =>
  store.dispatch({ type: 'SEARCH_RESULTS', payload: searchResults });

export const setIsFetchingBeatmaps = isFetching => store.dispatch({ type: 'FETCHINGBEATMAPS', payload: isFetching });

export const saveLastScrollPosition = lastScrollPosition =>
  store.dispatch({ type: 'SAVEBEATMAPSSCROLLPOS', payload: lastScrollPosition });

const sendSetWallpaperSignal = imageUri => ipcRenderer.send('set-wallpaper', imageUri);
const registerResponseListener = () => {
  ipcRenderer.on('set-wallpaper-response', () => store.dispatch({ type: 'SET_WALLPAPER', payload: false }));
};
const makeSetWallpaper = () => {
  registerResponseListener();
  return bgUri => {
    store.dispatch({ type: 'SET_WALLPAPER', payload: true });
    sendSetWallpaperSignal(bgUri);
  };
};
export const setWallpaper = makeSetWallpaper();
