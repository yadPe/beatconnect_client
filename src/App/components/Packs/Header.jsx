import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import getPacksDashboardData from './askBeatconnect';
import DropDown from '../common/DropDown';
import config from '../../../config';

const Header = ({ processBeatconnectPacksData, setSelectedMode }) => {
  // useEffect(() => {
  //   getPacksDashboardData(config.packs.availableModes[0], processBeatconnectPacksData);
  // }, [])

  const handleSelect = e => {
    const { value } = e.target;
    setSelectedMode(value);
    getPacksDashboardData(value, processBeatconnectPacksData);
  };
  return <DropDown onSelect={handleSelect} options={config.packs.availableModes} />;
};

const processBeatconnectPacksData = datas => {
  const output = {};

  datas.forEach(data => {
    if (data.map) {
      if (!output.lastWeekOverview) output.lastWeekOverview = [];
      output.lastWeekOverview.push(...data.slice(0, 4));
    } else {
      Object.values(data).forEach(value => {
        if (!output[value[0].mode]) output[value[0].mode] = {};
        output[value[0].mode][value[0].type] = value;
      });
    }
  });

  return { type: 'PACKS_DASHBOARD_QUERY_DATA', payload: output };
};

export default connect(
  null,
  { processBeatconnectPacksData },
)(Header);
