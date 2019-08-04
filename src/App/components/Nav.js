import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavPane, NavPaneItem, Text } from 'react-desktop/windows';
import Start from './Start'
import Matchs from './Matchs'
import Browse from './Browse'
import Settings from './Settings'
import Downloads from './Downloads';
import renderIcon from '../utils/renderIcons';


const Nav = ({ mpMatchs, theme, connected, bot }) => {
  const [selected, setSelected] = useState('Start');

  const renderItem = (title, content) => (
    <NavPaneItem
      title={title}
      icon={renderIcon(title, theme.style)}
      theme={theme.style}
      background={theme.primary}
      selected={selected === title}
      onSelect={() => setSelected(title)}
      padding="10px 20px"
      push
    >
      {content}
    </NavPaneItem>
  );

  return (
    <NavPane openLength={150} push color={theme.color} theme={theme.style}>
      {renderItem('Start', <Start connected={connected} theme={theme}/>)}
      {renderItem('Matchs', <Matchs matchs={mpMatchs} theme={theme} bot={bot}/>)}
      {renderItem('Browse', <Browse theme={theme} />)}
      {renderItem('Downloads', <Downloads theme={theme} />)}
      {renderItem('Settings', <Settings theme={theme}/>)}
    </NavPane>
  );
}

const mapStateToProps = ({ main }) => ({ ...main });
export default connect(mapStateToProps)(Nav);
