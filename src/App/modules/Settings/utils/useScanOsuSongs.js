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
  const { add: addTask, update, terminate } = useTasks();
  const history = useDownloadHistory();
  const [isScanning, setIsScanning] = useState(false);

  const scanOsuSongs = () => {
    if (isScanning) return;
    if (!osuPath && !osuSongsPath) {
      return alert('You need to select your osu! or songs folder before performing a scan');
    }
    setIsScanning(true);
    addTask({ name: 'Scanning beatmaps', status: 'running', description: '', section: 'Settings' });
    ipcRenderer.send('osuSongsScan', { osuPath, osuSongsPath, allowLegacy: true }); // User osu folder path
    ipcRenderer.on('osuSongsScanStatus', (e, args) => {
      update({
        name: 'Scanning beatmaps',
        description: `${Math.round(args * 100)}%`,
      });
    });
    ipcRenderer.on('osuSongsScanResults', (e, args) => {
      terminate('Scanning beatmaps');
      setIsScanning(false);
      if (args.err) error(`Error while scannings song: ${args.err}`);
      else {
        history.set(args);
        setLastScan({ date: Date.now(), beatmaps: Object.keys(args.beatmaps).length });
      }
    });
    ipcRenderer.on('osuSongsScanError', (e, args) => {
      terminate('Scanning beatmaps');
      setIsScanning(false);
      alert('Failed to scan beatmaps, check your songs and osu! path in settings section');
    });
  };

  return scanOsuSongs;
};

export const useOsuDbAutoScan = () => {
  const osuDbScan = useOsuDbScan();
  const osuSongsPath = useSelector(getOsuSongPath);
  const osuPath = useSelector(getOsuPath);
  useEffect(() => {
    if (osuPath && osuSongsPath !== '') {
      osuDbScan();
      scanOsuCollection(osuPath).then(console.log);
    }
  }, []);
};
