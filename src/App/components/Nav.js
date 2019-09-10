import React, { useState, cloneElement } from 'react';
import { connect } from 'react-redux';
import Bot from './Bot'
import Beatmaps from './Beatmaps'
import Settings from './Settings'
import Downloads from './Downloads';
import renderIcon from '../utils/renderIcons';
import NavPanel from './common/NavPanel';
import NavPanelItem from './common/NavPanel/Item';
import store from '../../store';


const Nav = ({ theme, connected, bot, sidePanelExpended, activeSection }) => {
  // const [selected, setSelected] = useState(activeSection);

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      icon={renderIcon(title, theme.style)}
      theme={theme}
      background={theme.primary}
      selected={activeSection === title}
      onSelect={() => store.dispatch({type: 'UPDATEACTIVESECTION', payload: title})}
      padding="10px 20px"
      header
    >
      {setHeader => cloneElement(content, { setHeaderContent: setHeader })}
    </NavPanelItem>
  );

  return (
    <NavPanel
      paneExpandedLength={150}
      defaultIsPanelExpanded={sidePanelExpended}
      onExpended={(expended) => store.dispatch({ type: 'SIDEPANELEXPENDED', payload: expended })}
      volume
      tasks
      expendable
      theme={theme}
    >
      {renderItem('Beatmaps', <Beatmaps theme={theme} />)}
      {renderItem('Downloads', <Downloads theme={theme} />)}
      {renderItem('Bot', <Bot connected={connected} bot={bot} theme={theme} />)}
      {renderItem('Settings', <Settings theme={theme} />)}
    </NavPanel>
  );
}

const mapStateToProps = ({ main, settings }) => ({ ...main, sidePanelExpended: settings.userPreferences.sidePanelExpended });
export default connect(mapStateToProps)(Nav);
