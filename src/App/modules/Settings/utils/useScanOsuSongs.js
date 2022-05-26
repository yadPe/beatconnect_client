/* eslint-disable no-alert */
/* eslint-disable no-console */
import { ipcRenderer } from 'electron';
import { error } from 'electron-log';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { useTasks } from '../../../Providers/TaskProvider.bs';
import { setLastScan } from '../reducer/actions';
import { getIsLazer, getOsuPath, getOsuSongPath } from '../reducer/selectors';
import { scanOsuCollection } from './scanOsuCollections';

export const useOsuDbScan = () => {
  const osuSongsPath = useSelector(getOsuSongPath);
  const osuPath = useSelector(getOsuPath);
  const { add: addTask, terminate } = useTasks();
  const history = useDownloadHistory();
  const [isScanning, setIsScanning] = useState(false);

  const scanOsuSongs = async isLazer => {
    console.log('scanOsuSongs', isLazer);
    // if (isLazer) return;
    if (isScanning) return;
    if (!osuPath && !osuSongsPath) {
      alert('You need to select your osu! or songs folder before performing a scan');
      return;
    }
    setIsScanning(true);
    addTask({ name: 'Scanning beatmaps', status: 'running', description: '', section: 'Settings' });
    try {
      const result = await ipcRenderer.invoke('osuSongsScan', { osuPath, isLazer });
      history.set(result);
      setLastScan({ date: Date.now(), beatmaps: Object.keys(result.beatmaps).length });
    } catch (e) {
      error(`Error while scannings song: ${e.message}`);
      alert(`Failed to scan beatmaps, please check your songs and osu! path in settings section\n ${e.message}`);
    } finally {
      terminate('Scanning beatmaps');
      setIsScanning(false);
    }
  };

  return scanOsuSongs;
};

export const useOsuDbAutoScan = () => {
  const osuDbScan = useOsuDbScan();
  const osuSongsPath = useSelector(getOsuSongPath);
  const osuPath = useSelector(getOsuPath);
  const isLazer = useSelector(getIsLazer);
  useEffect(() => {
    if (osuPath && osuSongsPath !== '') {
      osuDbScan(isLazer);
      scanOsuCollection(osuPath);
    }
  }, []);
};
