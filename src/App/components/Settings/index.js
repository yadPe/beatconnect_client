import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { remote, ipcRenderer, shell } from 'electron';
import { connect } from 'react-redux';
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setOsuSongsPath, setOsuPath, setLastScan, setImportMethod } from './actions';
import ConfLoader from './ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { TasksContext } from '../../../Providers/TasksProvider';

const Settings = ({ userPreferences, theme }) => {
  const history = useContext(HistoryContext)
  const { add, tasks } = useContext(TasksContext)
  const { irc, osuApi, prefix, autoImport, osuSongsPath, osuPath, lastScan, importMethod } = userPreferences;
  const [selected, setSelected] = useState('Bot');
  useEffect(() => {
    ConfLoader.save()
    return ConfLoader.save
  }, [userPreferences])

  const osuPathSetup = (song) => {
    const path = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (path) {
      if (song === 'song') setOsuSongsPath(path[0])
      else setOsuPath(path[0])
    }
  }


  const scanOsuSongs = () => {
    if (!osuPath && !osuSongsPath) return alert('You need to select your osu! or songs folder before')
    add({ name: 'Scanning beatmaps', status: 'running', description: '', section: 'Settings' })
    ipcRenderer.send('osuSongsScan', { osuPath, osuSongsPath, allowLegacy: true }) // User osu folder path
    ipcRenderer.on('osuSongsScanStatus', (e, args) => {
      add({ name: 'Scanning beatmaps', status: 'running', description: `${Math.round(args * 100)}%`, section: 'Settings' })
    })
    ipcRenderer.on('osuSongsScanResults', (e, args) => {
      if (tasks['Scanning beatmaps']) tasks['Scanning beatmaps'].terminate('Finished')
      //args = JSON.parse(args)
      if (args.err) console.error(`Error while scannings song: ${args.err}`)
      else {
        history.set({ ...history.history, ...args })
        setLastScan({date: Date.now(), beatmaps: Object.keys(args).length})
      }
    })
    ipcRenderer.on('osuSongsScanError', (e, args) => {
      if (tasks['Scanning beatmaps']) tasks['Scanning beatmaps'].terminate('Failed')
      alert('Failed to scan beatmaps, check your songs and osu! path in settings section')
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
        { name: 'Clear history', action: history.clear, type: 'Button' },
        { name: 'Osu! beatmaps scan', description: 'Scan your osu folder to import all your previously downloded beatmaps to your Beatconnect history', type: 'Text' },
        { name: osuSongsPath ? 'Scan Osu! songs' : 'Osu! folder not selected', action: scanOsuSongs, description: lastScan ? `${lastScan.beatmaps} beatmap sets found - Last scan ${new Date(lastScan.date).toDateString()}` : '', type: 'Button' },
      ],
      'Beatmaps location': [
        { name: osuPath || 'Osu! folder no selected', description: 'Giving access to the osu! folder allow osu!.db and collection.db read, enabling Beatconnect to auto sync on startup with your game', type: 'Text' },
        { name: 'Select your Osu! folder', action: osuPathSetup, type: 'Button' },
        { name: osuSongsPath || 'No songs folder selected', description: 'By selecting your osu songs folder enable the Bulk import and scan option', type: 'Text' },
        { name: 'Select your Osu! Songs folder', action: () => osuPathSetup('song'), type: 'Button' },
      ],
      'Beatmaps import method': [
        { name: 'Auto', value: importMethod === 'auto', action: () => setImportMethod('auto'), description: 'Import beatmaps to osu! as soon as downloaded. (This will cause osu! to open if not running)', type: 'CheckBox' },
        { name: 'Bulk', value: importMethod === 'bulk',  action: () => setImportMethod('bulk'), description: 'Beatmaps are placed in you songs folder after downloading and osu! will import them after reload of the beatmaps selection', disabled: !osuSongsPath || osuSongsPath === '', type: 'CheckBox' },
        { name: 'Manual', value: importMethod === 'manual',  action: () => setImportMethod('manual'), description: 'Downloaded beatmaps are stored as is in your download folder inside the Beatconnect folder', type: 'CheckBox' },
      ]
    }, 
  }

  const appVersion = remote.app.getVersion();
  settings[appVersion] = {
    version: [
      { name: `Thanks for using Beatconnect! - v${appVersion}` }
    ]
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