import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { useTheme } from 'react-jss';
import { remote, ipcRenderer, shell } from 'electron';
import { connect } from 'react-redux';
import {
  setIrcUser,
  setIrcPass,
  setIRCIsBot,
  setOSUApiKey,
  setPrefix,
  setOsuSongsPath,
  setOsuPath,
  setLastScan,
  setImportMethod,
  saveThemeAccentColor,
} from './reducer/actions';
import ConfLoader from './helpers/ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { HistoryContext } from '../../Providers/HistoryProvider';
import ColorPicker from '../common/ColorPicker';
import { useSetTheme } from '../../Providers/ThemeProvider';
import { useDownloadQueue } from '../../Providers/downloadManager';
import config from '../../../shared/config';
import { useTasks } from '../../Providers/TaskProvider.bs';

const Settings = ({ userPreferences }) => {
  const theme = useTheme();
  const history = useContext(HistoryContext);
  const { add, update, terminate } = useTasks();
  const { setPath } = useDownloadQueue();
  const { irc, osuApi, prefix, osuSongsPath, osuPath, lastScan, importMethod } = userPreferences;
  const [selected, setSelected] = useState('General');
  const { setAccentColor } = useSetTheme();
  useEffect(() => {
    ConfLoader.save();
    return ConfLoader.save;
  }, [userPreferences]);

  const osuPathSetup = async song => {
    const { filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (filePaths.length) {
      if (song === 'song') {
        setPath(userPreferences.importMethod, filePaths[0]);
        setOsuSongsPath(filePaths[0]);
      } else setOsuPath(filePaths[0]);
    }
  };

  const scanOsuSongs = () => {
    if (!osuPath && !osuSongsPath) return alert('You need to select your osu! or songs folder before');
    add({ name: 'Scanning beatmaps', status: 'running', description: '', section: 'Settings' });
    ipcRenderer.send('osuSongsScan', { osuPath, osuSongsPath, allowLegacy: true }); // User osu folder path
    ipcRenderer.on('osuSongsScanStatus', (e, args) => {
      update({
        name: 'Scanning beatmaps',
        description: `${Math.round(args * 100)}%`,
      });
    });
    ipcRenderer.on('osuSongsScanResults', (e, args) => {
      terminate('Scanning beatmaps');
      if (args.err) console.error(`Error while scannings song: ${args.err}`);
      else {
        history.set({ ...history.history, ...args });
        setLastScan({ date: Date.now(), beatmaps: Object.keys(args).length });
      }
    });
    ipcRenderer.on('osuSongsScanError', (e, args) => {
      terminate('Scanning beatmaps');
      alert('Failed to scan beatmaps, check your songs and osu! path in settings section');
    });
  };

  const handleAccentColorSelect = e => {
    const { value } = e.target;
    saveThemeAccentColor(value);
    setAccentColor(value);
  };

  const handleImportMethodChange = newMethod => {
    setImportMethod(newMethod);
    setPath(newMethod, osuSongsPath);
  };

  const settings = {
    General: {
      theme: [
        {
          name: 'Accent color',
          component: ColorPicker,
          props: {
            value: theme.palette.primary.accent,
            onChange: handleAccentColorSelect,
          },
        },
      ],
    },
    Bot: {
      IRC: [
        {
          name: 'Special bot account',
          value: irc.isBotAccount,
          action: setIRCIsBot,
          type: Boolean,
          description: 'Disable flood protection (2.5sec cooldown per msg) only for granteed account',
        },
        {
          name: 'Bancho IRC credentials',
          description: `If you don't have them already clic here or go to osu.ppy.sh/p/irc`,
          action: () => shell.openItem('https://osu.ppy.sh/p/irc'),
          type: 'Text',
        },
        { name: 'Username', value: irc.username, action: setIrcUser, type: String },
        { name: 'Password', value: irc.password, action: setIrcPass, type: String, pass: true },
      ],
      Misc: [
        { name: 'Osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
        { name: 'Bot prefix', value: prefix, action: setPrefix, type: String },
      ],
    },
    Downloads: {
      History: [
        { name: 'Clear history', action: history.clear, type: 'Button' },
        {
          name: 'Osu! beatmaps scan',
          description:
            'Scan your osu folder to import all your previously downloaded beatmaps to your Beatconnect history',
          type: 'Text',
        },
        {
          name: osuSongsPath ? 'Scan Osu! songs' : 'Osu! folder not selected',
          action: scanOsuSongs,
          description: lastScan
            ? `${lastScan.beatmaps} beatmap sets found - Last scan ${new Date(lastScan.date).toDateString()}`
            : '',
          type: 'Button',
        },
      ],
      'Beatmaps location': [
        {
          name: osuPath || 'Osu! folder no selected',
          description:
            'Giving access to the osu! folder allow osu!.db and collection.db read, enabling Beatconnect to auto sync on startup with your game',
          type: 'Text',
        },
        { name: 'Select your Osu! folder', action: osuPathSetup, type: 'Button' },
        {
          name: osuSongsPath || 'No songs folder selected',
          description: 'By selecting your osu songs folder enable the Bulk import and scan option',
          type: 'Text',
        },
        { name: 'Select your Osu! Songs folder', action: () => osuPathSetup('song'), type: 'Button' },
      ],
      'Beatmaps import method': [
        {
          name: 'Auto',
          value: importMethod === config.settings.importMethod.auto,
          action: () => handleImportMethodChange(config.settings.importMethod.auto),
          description:
            'Import beatmaps to osu! as soon as downloaded. (This will cause osu! to open if not currently running)',
          type: 'CheckBox',
        },
        {
          name: 'Bulk',
          value: importMethod === config.settings.importMethod.bulk,
          action: () => handleImportMethodChange(config.settings.importMethod.bulk),
          description:
            'Beatmaps are placed in you songs folder after downloading and osu! will import them after reload of the beatmaps selection',
          disabled: !osuSongsPath || osuSongsPath === '',
          type: 'CheckBox',
        },
        {
          name: 'Manual',
          value: importMethod === config.settings.importMethod.manual,
          action: () => handleImportMethodChange(config.settings.importMethod.manual),
          description: 'Beatmaps are save to your default download folder',
          type: 'CheckBox',
        },
      ],
    },
  };

  const appVersion = remote.app.getVersion();
  settings[appVersion] = {
    version: [{ name: `Thanks for using Beatconnect! - v${appVersion}` }],
  };

  const renderItems = () => {
    return Object.keys(settings).map(setting => (
      <NavPanelItem
        title={setting}
        background={theme.palette.primary.dark}
        selected={selected === setting}
        onSelect={() => setSelected(setting)}
        padding="10px 20px"
      >
        {setHeader => cloneElement(<Setting settingCategory={settings[setting]} />, { setHeaderContent: setHeader })}
      </NavPanelItem>
    ));
  };

  return (
    <div className="menuContainer Settings" style={{ transition: 'background 0ms', textAlign: 'center' }}>
      <NavPanel
        paneExpandedLength={150}
        defaultIsPanelExpanded
        sidePanelBackground={theme.palette.secondary.dark}
        subPanel
      >
        {renderItems()}
      </NavPanel>
    </div>
  );
};

const mapStateTotProps = ({ settings }) => ({ ...settings });
export default connect(mapStateTotProps)(Settings);
