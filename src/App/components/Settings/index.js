import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { connect } from 'react-redux'
import { setIrcUser, setIrcPass, setIRCIsBot, setOSUApiKey, setPrefix, setAutoBeat, setAutoImport } from './actions';
import ConfLoader from './ConfLoader';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import Setting from './Setting';
import { HistoryContext } from '../../../Providers/HistoryProvider';



const Settings = ({ userPreferences, theme }) => {
  const history = useContext(HistoryContext)
  const { irc, osuApi, prefix, autoImport } = userPreferences;
  const [selected, setSelected] = useState('Bot');
  useEffect(() => {
    return ConfLoader.save
  }, [])

  const settings = {
    Bot: {
      irc: [
        { name: 'irc user', value: irc.username, action: setIrcUser, type: String },
        { name: 'irc password', value: irc.password, action: setIrcPass, type: String, pass: true },
        { name: 'special bot account', value: irc.isBotAccount, action: setIRCIsBot, type: Boolean },
      ],
      misc: [
        { name: 'osu api key', value: osuApi.key, action: setOSUApiKey, type: String, pass: true },
        { name: 'bot prefix', value: prefix, action: setPrefix, type: String }
      ]
    },
    Downloads: {
      import: [
        { name: 'auto import maps', value: autoImport, action: setAutoImport, type: Boolean },
        { name: 'clear history', action: history.clear, type: 'Button' }
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