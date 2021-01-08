import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import getPacksDashboardData from './helpers/askBeatconnect';
import DropDown from '../common/DropDown';
import config from '../../../shared/config';
import { processBeatconnectPacksData as processPacksAction } from './reducer/packs.actions';

const Header = ({ processBeatconnectPacksData, setSelectedMode }) => {
  useEffect(() => {
    getPacksDashboardData(config.packs.availableModes[0], processBeatconnectPacksData);
  }, []);

  const handleSelect = e => {
    const { value } = e.target;
    setSelectedMode(value);
    getPacksDashboardData(value, processBeatconnectPacksData);
  };
  return (
    <DropDown onSelect={handleSelect} options={_.zip(config.packs.availableModesLabels, config.packs.availableModes)} />
  );
};

export default connect(
  null,
  { processBeatconnectPacksData: processPacksAction },
)(Header);
