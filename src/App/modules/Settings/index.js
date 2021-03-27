import React, { useEffect, useState, cloneElement } from 'react';
import { useTheme } from 'react-jss';
import { remote, shell } from 'electron';
import { connect } from 'react-redux';
import { error } from 'electron-log';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix } from './reducer/actions';
import ConfLoader from './helpers/ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { useDownloadHistory } from '../../Providers/HistoryProvider';
import ColorPicker from '../common/ColorPicker';
import config from '../../../shared/config';
import useSettingsUtils from './utils/useSettingsUtils';
import { useOsuDbScan } from './utils/useScanOsuSongs';

const Settings = ({ userPreferences }) => {
  const { irc, osuApi, prefix, osuSongsPath, osuPath, lastScan, importMethod } = userPreferences;
  const [selectedCategory, setSelectedCategory] = useState('General');
  const theme = useTheme();
  const history = useDownloadHistory();

  const { handleAccentColorSelect, handleImportMethodChange, osuPathSetup } = useSettingsUtils(userPreferences);
  const scanOsuSongs = useOsuDbScan();

  useEffect(() => {
    return ConfLoader.save;
  }, []);

  const settings = {
    General: {
      Osu: [
        { name: 'Select your Osu! folder', action: osuPathSetup, type: 'Button' },
        {
          name: osuPath || 'Osu! folder no set',
          description:
            'Giving access to the osu! folder allow osu!.db and collection.db read, enabling Beatconnect to auto sync on startup with your game',
          type: 'Text',
        },
        { name: 'Select your Osu! Songs folder', action: () => osuPathSetup('song'), type: 'Button' },
        {
          name: osuSongsPath || 'No songs folder set',
          description: 'By selecting your osu songs folder enable the Bulk import and scan option',
          type: 'Text',
        },
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
          action: () => shell.openPath('https://osu.ppy.sh/p/irc').catch(error),
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
        {
          name: osuSongsPath ? 'Scan Osu! songs' : 'Osu! folder not set',
          action: scanOsuSongs,
          description: lastScan
            ? `${lastScan.beatmaps} beatmap sets found - Last scan ${new Date(lastScan.date).toLocaleString()}`
            : '',
          type: 'Button',
        },
        {
          name: 'Osu! beatmaps scan',
          description:
            'Scan your osu folder to import all your previously downloaded beatmaps to your Beatconnect history',
          type: 'Text',
        },
        { name: 'Clear history', action: history.clear, type: 'Button' },
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
        selected={selectedCategory === setting}
        onSelect={() => setSelectedCategory(setting)}
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
