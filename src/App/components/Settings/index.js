import React, { useEffect, useState, cloneElement } from 'react';
import { connect } from 'react-redux'
import { remote } from 'electron';
import Volume from './Volume'
import History from './History';
import ConfLoader from './ConfLoader';
import { updateVolume } from './actions';
import Configuration from './Configuration';
import Theme from './Theme';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import renderIcons from '../../utils/renderIcons';


const Settings = ({ userPreferences, theme }) => {
  const [selected, setSelected] = useState('Bot');
  useEffect(() => {
    return ConfLoader.save
  }, [])

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      theme={theme}
      background={theme.primary}
      selected={selected === title}
      onSelect={() => setSelected(title)}
      padding="10px 20px"
    >
      {setHeader => cloneElement(content, { setHeaderContent: setHeader })}
    </NavPanelItem>
  );

  return (
    <div className='menuContainer Settings' style={{ transition: 'background 0ms', textAlign: 'center' }}>
      <NavPanel
        paneExpandedLength={150}
        defaultIsPanelExpanded
        sidePanelBackground='#1d1d1d'
        theme={theme}
      >
        {renderItem('Bot', <Configuration theme={theme} values={userPreferences} />)}
        {renderItem('Downloads', <History theme={theme} />)}
        {renderItem('Theme (Beta)', <Theme theme={theme} />)}
        {renderItem(`v${remote.app.getVersion()}`, <div>Thank you for using Beatconnect!</div>)}
      </NavPanel>
    </div>
  );
}

const mapStateTotProps = ({ settings, main }) => ({ ...settings, theme: main.theme })
export default connect(mapStateTotProps)(Settings);