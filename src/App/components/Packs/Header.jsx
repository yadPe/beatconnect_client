import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import getPacksDashboardData from './askBeatconnect';
import DropDown from '../common/DropDown';
import config from '../../../config';
import { puts } from 'util';

const Header = ({ processBeatconnectPacksData, setSelectedMode }) => {
  useEffect(() => {
    getPacksDashboardData(config.packs.availableModes[0], processBeatconnectPacksData);
  }, []);

  const handleSelect = e => {
    const { value } = e.target;
    setSelectedMode(value);
    getPacksDashboardData(value, processBeatconnectPacksData);
  };
  return <DropDown onSelect={handleSelect} options={config.packs.availableModes} />;
};

const processBeatconnectPacksData = datas => {
  const output = {
    lastWeekOverview: [],
    std: {
      weekly: [],
      monthly: [],
      yearly: [],
    },
    ctb: {
      weekly: [],
      monthly: [],
      yearly: [],
    },
    mania: {
      weekly: [],
      monthly: [],
      yearly: [],
    },
    taiko: {
      weekly: [],
      monthly: [],
      yearly: [],
    },
  };

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
  console.log(output);
  return { type: 'PACKS_DASHBOARD_QUERY_DATA', payload: output };
};

export default connect(
  null,
  { processBeatconnectPacksData },
)(Header);
