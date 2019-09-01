import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { remote, ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setAutoBeat, setAutoImport, setOsuSongsPath } from './actions';
import ConfLoader from './ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { HistoryContext } from '../../../Providers/HistoryProvider';

const Settings = ({ userPreferences, theme }) => {
  const history = useContext(HistoryContext)
  const { irc, osuApi, prefix, autoImport, osuSongsPath } = userPreferences;
  const [selected, setSelected] = useState('Bot');
  useEffect(() => {
    return ConfLoader.save
  }, [])

  const osuPathSetup = () => {
    const path = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (path) setOsuSongsPath(path[0])
  }

  const scanOsuSongs = () => {
    if (!osuSongsPath) return alert('You need to select your songs folder before')
    ipcRenderer.send('osuSongsScan', osuSongsPath) // User osu folder path
    ipcRenderer.on('osuSongsScanResults', (e, args) => {
      args = JSON.parse(args)
      if (args.err) console.error(`Error while scannings song: ${args.err}`)
      else history.set({ ...history.history, ...args })
    })
  }

  const settings = {
    Bot: {
      irc: [
        { name: 'Special bot account', value: irc.isBotAccount, action: setIRCIsBot, type: Boolean, description: 'Disable flood protection (2.5sec cooldown per msg) only for granteed account' },
        { name: 'Username', value: irc.username, action: setIrcUser, type: String },
        { name: 'Password', value: irc.password, action: setIrcPass, type: String, pass: true },
      ],
      misc: [
        { name: 'Osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
        { name: 'Bot prefix', value: prefix, action: setPrefix, type: String }
      ]
    },
    Downloads: {
      import: [
        { name: 'Auto import maps', value: autoImport, action: setAutoImport, type: Boolean },
        { name: 'Scan Osu! songs', value: autoImport, action: scanOsuSongs, type: 'Button' },
        { name: 'Select your Osu! Songs folder', value: autoImport, action: osuPathSetup, type: 'Button' },
        { name: 'Clear history', action: history.clear, type: 'Button' }
      ]
    },
    Version :{
      version: [
        { name: `Thanks for using Beatconnect! - ${remote.app.getVersion()}` }
      ]
    }
  }

  const renderItems = () => {
    return Object.keys(settings).map(setting => <NavPanelItem
      title={setting}
      theme={theme}
      background={theme.primary}
      selected={selected === setting}
      onSelect={() => setSelected(setting)}
      padding="10px 20px"
    >
      {setHeader => cloneElement(<Setting theme={theme} settingCategory={settings[setting]} />, { setHeaderContent: setHeader })}
    </NavPanelItem>
    )
  };

  return (
    <div className='menuContainer Settings' style={{ transition: 'background 0ms', textAlign: 'center' }}>
      <NavPanel
        paneExpandedLength={150}
        defaultIsPanelExpanded
        sidePanelBackground='#1d1d1d'
        theme={theme}
      >
        {renderItems()}
      </NavPanel>
    </div>
  );
}

const mapStateTotProps = ({ settings, main }) => ({ ...settings, theme: main.theme })
export default connect(mapStateTotProps)(Settings);