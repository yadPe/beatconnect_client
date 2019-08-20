import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavPane, NavPaneItem } from 'react-desktop/windows';
import Start from './Start'
import Matchs from './Matchs'
import Beatmaps from './Beatmaps'
import Settings from './Settings'
import Downloads from './Downloads';
import renderIcon from '../utils/renderIcons';
import NavPanel from './common/NavPanel';
import NavPanelItem from './common/NavPanel/Item';
import store from '../../store';


const Nav = ({ mpMatchs, theme, connected, bot, sidePanelExpended }) => {
  const [selected, setSelected] = useState('Start');

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      icon={renderIcon(title, theme.style)}
      theme={theme}
      background={theme.primary}
      selected={selected === title}
      onSelect={() => setSelected(title)}
      padding="10px 20px"
    >
      {content}
    </NavPanelItem>
  );

  return (
    <NavPanel
    paneExpandedLength={150} 
    defaultIsPanelExpanded={sidePanelExpended}
    onExpended={(expended) => store.dispatch({type: 'SIDEPANELEXPENDED', payload: expended})}
    push 
    theme={theme}
    //color={theme.color} 
    dark={theme.style}>
      {renderItem('Start', <Start connected={connected} theme={theme}/>)}
      {renderItem('Matchs', <Matchs matchs={mpMatchs} theme={theme} bot={bot}/>)}
      {renderItem('Beatmaps', <Beatmaps theme={theme} />)}
      {renderItem('Downloads', <Downloads theme={theme} />)}
      {renderItem('Settings', <Settings theme={theme}/>)}
    </NavPanel> 
  );
}

const mapStateToProps = ({ main, settings }) => ({ ...main, sidePanelExpended: settings.userPreferences.sidePanelExpended });
export default connect(mapStateToProps)(Nav);
