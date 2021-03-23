import { remote } from 'electron';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import { useSetTheme } from '../../../Providers/ThemeProvider';
import { saveThemeAccentColor, setImportMethod, setOsuSongsPath, setOsuPath } from '../reducer/actions';

const useSettingsUtils = ({ osuSongsPath, importMethod }) => {
  const { setPath } = useDownloadQueue();
  const { setAccentColor } = useSetTheme();

  const osuPathSetup = async song => {
    const { filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (filePaths.length) {
      if (song === 'song') {
        setPath(importMethod, filePaths[0]);
        setOsuSongsPath(filePaths[0]);
      } else setOsuPath(filePaths[0]);
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
