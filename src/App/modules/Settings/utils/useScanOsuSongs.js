/* eslint-disable no-alert */
/* eslint-disable no-console */
import { ipcRenderer } from 'electron';
import { error } from 'electron-log';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { useTasks } from '../../../Providers/TaskProvider.bs';
import { setLastScan } from '../reducer/actions';
import { getOsuPath, getOsuSongPath } from '../reducer/selectors';
import { scanOsuCollection } from './scanOsuCollections';

export const useOsuDbScan = () => {
  const osuSongsPath = useSelector(getOsuSongPath);
  const osuPath = useSelector(getOsuPath);
  const { add: addTask, terminate } = useTasks();
  const history = useDownloadHistory();
  const [isScanning, setIsScanning] = useState(false);

  const scanOsuSongs = async () => {
    if (isScanning) return;
    if (!osuPath && !osuSongsPath) {
      alert('You need to select your osu! or songs folder before performing a scan');
      return;
    }
    setIsScanning(true);
    addTask({ name: 'Scanning beatmaps', status: 'running', description: '', section: 'Settings' });
    const result = await ipcRenderer.invoke('osuSongsScan', { osuPath });

    terminate('Scanning beatmaps');
    setIsScanning(false);
    if (result.error) {
      throw new Error(`Error while scannings song: ${result.error}`);
    } else {
      history.set(result);
      setLastScan({ date: Date.now(), beatmaps: Object.keys(result.beatmaps).length });
    }
  };

  return scanOsuSongs;
};

export const useOsuDbAutoScan = () => {
  const osuDbScan = useOsuDbScan();
  const osuSongsPath = useSelector(getOsuSongPath);
  const osuPath = useSelector(getOsuPath);
  useEffect(() => {
    if (osuPath && osuSongsPath !== '') {
      osuDbScan()
        .then(() => console.log('Osu db scan success!'))
        .catch(err => {
          error(`Error while scannings song: ${err.message}`);
          alert('Failed to scan beatmaps, check your songs and osu! path in settings section');
        });
      scanOsuCollection(osuPath).then(() => console.log('Collection scan success!'));
    }
  }, []);
};
