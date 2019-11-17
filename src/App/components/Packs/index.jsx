import React, { useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Group from './Group';
import BeatmapPackDetail from './BeatmapPackDetail';
import Header from './Header';
import config from '../../../config';

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
    return () => selectedPack || setHeaderContent(null);
  }, [selectedPack]);

  if (selectedPack.pack) {
    return <BeatmapPackDetail pack={selectedPack.pack} select={setSelectedPack} />;
  }

  const { lastWeekOverview } = packsDashboardData;
  const { weekly, monthly, yearly } = packsDashboardData[selectedMode] || {};
  return (
    <>
      <div>
        <h2>Welcome to the packs section</h2>
        <h5>
          Here you will find collections of all ranked beatmaps grouped by mode for the last weeks, months and years
        </h5>
      </div>
      <div className={classes.Packs}>
        <div style={{ gridArea: 'overview' }}>
          <Group name="Latest collections" packs={lastWeekOverview} theme={theme} select={setSelectedPack} />
        </div>
        {weekly && !(weekly.length === 0) && (
          <div style={{ gridArea: 'weeks' }}>
            <Group name="This month" packs={weekly} theme={theme} select={setSelectedPack} />
          </div>
        )}
        <div style={{ gridArea: 'months' }}>
          <Group name="Past months" packs={monthly} theme={theme} select={setSelectedPack} />
        </div>
        <div style={{ gridArea: 'years' }}>
          <Group name="Past years" packs={yearly} theme={theme} select={setSelectedPack} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ main }) => ({ packsDashboardData: main.packsDashboardData });
export default compose(
  connect(mapStateToProps),
  injectSheet(styles),
)(Packs);
