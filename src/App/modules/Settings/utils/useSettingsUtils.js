import { remote, ipcRenderer } from 'electron';
import { error } from 'electron-log';
import { join } from 'path';
import { useSelector } from 'react-redux';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import { useSetTheme } from '../../../Providers/ThemeProvider';
import { saveThemeAccentColor, setImportMethod, setOsuSongsPath, setOsuPath } from '../reducer/actions';
import { getOsuSongPath } from '../reducer/selectors';

const checkOsuPath = async path => {
  try {
    const isPathValid = await ipcRenderer.invoke('validate-osu-path', path);
    return !!isPathValid;
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert(`An error occured while setting the osu folder, please try again.`);
    error('[osuPathSetup]: ', e);
    return false;
  }
};

const useSettingsUtils = ({ osuSongsPath, importMethod }) => {
  const { setPath } = useDownloadQueue();
  const { setAccentColor } = useSetTheme();
  const currentOsuSongsPath = useSelector(getOsuSongPath);

  const osuPathSetup = async song => {
    const { filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (filePaths.length) {
      if (song === 'song') {
        setPath(importMethod, filePaths[0]);
        setOsuSongsPath(filePaths[0]);
      } else {
        const isValid = await checkOsuPath(filePaths[0]);
        if (!isValid) {
          // eslint-disable-next-line no-alert
          alert(`The provided folder doesn't seems be a valid osu folder.`);
          return;
        }
        setOsuPath(filePaths[0]);
        if (!currentOsuSongsPath) {
          setOsuSongsPath(join(filePaths[0], 'Songs'));
        }
      }
    }
  };

  const handleImportMethodChange = newMethod => {
    setImportMethod(newMethod);
    setPath(newMethod, osuSongsPath);
  };

  const handleAccentColorSelect = e => {
    const { value } = e.target;
    saveThemeAccentColor(value);
    setAccentColor(value);
  };

  return { osuPathSetup, handleImportMethodChange, handleAccentColorSelect };
};

export default useSettingsUtils;
