import React, { cloneElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import Bot from './Bot';
import Beatmaps from './Beatmaps';
import Packs from './Packs';
import Settings from './Settings';
import Downloads from './Downloads';
import renderIcon from '../helpers/renderIcons';
import NavPanel from './common/NavPanel';
import NavPanelItem from './common/NavPanel/Item';
import store from '../../shared/store';

const { trackNavigation } = remote.getGlobal('tracking');

const switchSectionTo = section => {
  store.dispatch({ type: 'UPDATEACTIVESECTION', payload: section });
};

const Nav = ({ connected, instance: botInstance, sidePanelExpended, activeSection }) => {
  useEffect(() => {
    trackNavigation(activeSection);
  }, [activeSection]);

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      icon={renderIcon({ name: title })}
      selected={activeSection === title}
      onSelect={() => switchSectionTo(title)}
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
      onExpended={expended => store.dispatch({ type: 'SIDEPANELEXPENDED', payload: expended })}
      volume
      tasks
      expendable
    >
      {renderItem('Beatmaps', <Beatmaps />)}
      {renderItem('Packs', <Packs />)}
      {renderItem('Downloads', <Downloads />)}
      {renderItem('Bot', <Bot connected={connected} bot={botInstance} />)}
      {renderItem('Settings', <Settings />)}
    </NavPanel>
  );
};

const mapStateToProps = ({ navigation, settings, bot }) => ({
  activeSection: navigation.activeSection,
  sidePanelExpended: settings.userPreferences.sidePanelExpended,
  ...bot,
});
export default connect(mapStateToProps)(Nav);
