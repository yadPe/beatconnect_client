import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { remote, ipcRenderer, shell } from 'electron';
import { connect } from 'react-redux';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setAutoBeat, setAutoImport, setOsuSongsPath, setLastScan } from './actions';
import ConfLoader from './ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { TasksContext } from '../../../Providers/TasksProvider';

const Settings = ({ userPreferences, theme }) => {
  const history = useContext(HistoryContext)
  const { add, tasks } = useContext(TasksContext)
  const { irc, osuApi, prefix, autoImport, osuSongsPath, lastScan } = userPreferences;
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
    add({ name: 'Scanning beatmaps folder', status: 'running', description: ''  })
    ipcRenderer.send('osuSongsScan', osuSongsPath) // User osu folder path
    ipcRenderer.on('osuSongsScanResults', (e, args) => {
      if (tasks['Scanning beatmaps folder']) tasks['Scanning beatmaps folder'].terminate('Finished')
      args = JSON.parse(args)
      if (args.err) console.error(`Error while scannings song: ${args.err}`)
      else {
        history.set({ ...history.history, ...args })
        setLastScan({date: Date.now(), beatmaps: Object.keys(args).length})
      }
    })
  }

  const settings = {
    Bot: {
      IRC: [
        { name: 'Special bot account', value: irc.isBotAccount, action: setIRCIsBot, type: Boolean, description: 'Disable flood protection (2.5sec cooldown per msg) only for granteed account' },
        { name: 'Bancho IRC credentials', description: `If you don't have them already clic here or go to osu.ppy.sh/p/irc`, action: () => shell.openItem('https://osu.ppy.sh/p/irc'), type: 'Text' },
        { name: 'Username', value: irc.username, action: setIrcUser, type: String },
        { name: 'Password', value: irc.password, action: setIrcPass, type: String, pass: true },
      ],
      Misc: [
        { name: 'Osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
        { name: 'Bot prefix', value: prefix, action: setPrefix, type: String }
      ]
    },
    Downloads: {
      History: [
        { name: 'Auto import maps', value: autoImport, action: setAutoImport, type: Boolean },
        // { name: 'Beatmaps import method', value: 'auto', action: null, options: ['auto', 'bulk', 'manual'], type: 'Select' },
        { name: 'Clear history', action: history.clear, type: 'Button' },
      ],
      'Beatmaps location': [
        { name: osuSongsPath || 'No songs folder selected', description: 'By selecting your osu songs folder enable the Bulk import and scan option', type: 'Text' },
        { name: 'Select your Osu! Songs folder', value: autoImport, action: osuPathSetup, type: 'Button' },
        { name: 'Osu! beatmaps scan', description: 'Scan your osu folder to import all your previously downloded beatmaps to your Beatconnect history', type: 'Text' },
        { name: osuSongsPath ? 'Scan Osu! songs' : 'Songs folder not selected', value: autoImport, action: scanOsuSongs, description: lastScan ? `${lastScan.beatmaps} beatmaps found - Last scan ${new Date(lastScan.date).toDateString()}` : '', type: 'Button' },
      ]
    }, 
    Version: {
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