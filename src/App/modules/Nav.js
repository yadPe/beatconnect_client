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
import config from '../../shared/config';
import MyLibrary from './MyLibrary';
import { changeCurrentSection } from '../app.actions';

const { trackNavigation } = remote.getGlobal('tracking');

const switchSectionTo = section => {
  store.dispatch(changeCurrentSection(section));
};

const Nav = ({ connected, instance: botInstance, sidePanelExpended, activeSection, packsDisabled }) => {
  useEffect(() => {
    trackNavigation(activeSection);
  }, [activeSection]);

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      icon={renderIcon({ name: title, color: packsDisabled && title === 'Packs' && '#7a7a7a' })}
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
      autoExpend
      volume
      tasks
      expendable
    >
      {renderItem('Beatmaps', <Beatmaps />)}
      {renderItem('Packs', <Packs />)}
      {renderItem('Downloads', <Downloads />)}
      {renderItem('Bot', <Bot connected={connected} bot={botInstance} />)}
      {renderItem('My Library', <MyLibrary />)}
      {renderItem('Settings', <Settings />)}
    </NavPanel>
  );
};

const mapStateToProps = ({ navigation, settings, bot, packs }) => ({
  activeSection: navigation.activeSection,
  sidePanelExpended: settings.userPreferences.sidePanelExpended,
  packsDisabled: packs.serviceStatus === config.packs.serviceStatus.disabled,
  ...bot,
});
export default connect(mapStateToProps)(Nav);
