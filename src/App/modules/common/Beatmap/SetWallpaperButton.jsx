import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import config from '../../../../shared/config';

const makeBeatmapBackgroundUrl = (beatmapSetId, beatmapId) => `${config.beatconnect}/bg/${beatmapSetId}/${beatmapId}/`;
const sendSetWallpaperSignal = imageUri => ipcRenderer.send('set-wallpaper', imageUri);

const SetWallpaperButton = ({ beatmapSetId, beatmapId }) => {
  const [state, setState] = useState({ loading: false, listenerRegistered: false });
  const setIsNotLoading = () => setState({ ...state, loading: false });
  const registerResponseListener = () => {
    ipcRenderer.on('set-wallpaper-response', setIsNotLoading);
  };
  useEffect(() => {
    return () => state.listenerRegistered && ipcRenderer.removeListener('set-wallpaper-response', setIsNotLoading);
  });
  const handleClick = () => {
    setState({ ...state, loading: true });
    registerResponseListener();
    sendSetWallpaperSignal(makeBeatmapBackgroundUrl(beatmapSetId, beatmapId));
  };
  return <button onClick={handleClick}>{state.loading ? 'Loading...' : 'Set walpaper!'}</button>;
};

export default SetWallpaperButton;
