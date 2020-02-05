import React, { useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Group from './components/Group';
import BeatmapPackDetail from './BeatmapPackDetail';
import Header from './Header';
import config from '../../../shared/config';

const styles = {
  Packs: {
    textAlign: 'auto',
    margin: 'auto 5rem',
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: 'auto',
    gridGap: '30px',
    gridTemplateAreas: `
    'overview overview'
    'weeks weeks'
    'months months'
    'years years'`,
  },
};

const Packs = ({ classes, theme, setHeaderContent, packsDashboardData }) => {
  const [selectedPack, setSelected] = useState({});
  const [selectedMode, setSelectedMode] = useState(config.packs.availableModes[0]);

  const setSelectedPack = selection => setSelected({ ...selectedPack, ...selection });

  useEffect(() => {
    if (selectedPack.pack) {
      if (selectedPack.header) setHeaderContent(selectedPack.header);
    } else {
      setHeaderContent(<Header setSelectedMode={setSelectedMode} />);
    }
    return () => setHeaderContent(null);
  }, [selectedPack]);

  if (selectedPack.pack) {
    return <BeatmapPackDetail pack={selectedPack.pack} select={setSelectedPack} />;
  }

  const { lastWeekOverview } = packsDashboardData;
  const { weekly, monthly, yearly } = packsDashboardData[selectedMode] || {};
  return (
    <div className={classes.Packs}>
      <div style={{ gridArea: 'overview' }}>
        <Group name="Latest collections" packs={lastWeekOverview} select={setSelectedPack} />
      </div>
      {weekly && !(weekly.length === 0) && (
        <div style={{ gridArea: 'weeks' }}>
          <Group name="This month" packs={weekly} select={setSelectedPack} />
        </div>
      )}
      <div style={{ gridArea: 'months' }}>
        <Group name="Past months" packs={monthly} select={setSelectedPack} />
      </div>
      <div style={{ gridArea: 'years' }}>
        <Group name="Past years" packs={yearly} select={setSelectedPack} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ packs }) => ({ packsDashboardData: packs.packsDashboardData });
export default compose(
  connect(mapStateToProps),
  injectSheet(styles),
)(Packs);
