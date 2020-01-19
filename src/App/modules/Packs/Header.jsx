import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import getPacksDashboardData from './askBeatconnect';
import DropDown from '../common/DropDown';
import config from '../../../config';
import store from '../../../store';

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

const processBeatconnectPacksData = datas => {
  const output = store.getState().main.packsDashboardData;
  output.lastWeekOverview = [];
  datas.forEach(data => {
    if (data.map) {
      output.lastWeekOverview.push(...data.slice(0, 4));
    } else {
      Object.values(data).forEach(value => {
        if (value.length) output[value[0].mode][value[0].type] = value[0].type === 'weekly' ? value.slice(1) : value;
        if (value.length && value[0].type === 'monthly' && !output.lastWeekOverview.length) {
          output.lastWeekOverview.push(value[0]);
        }
      });
    }
  });
  return { type: 'PACKS_DASHBOARD_QUERY_DATA', payload: output };
};

export default connect(
  null,
  { processBeatconnectPacksData },
)(Header);
