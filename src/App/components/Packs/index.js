import React, { useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import Group from './Group';
import weekly from './weekly.json';
import monthly from './monthly.json';
import yearly from './yearly.json';
import BeatmapPackDetail from './BeatmapPackDetail';

const styles = {
  Packs: {
    textAlign: 'auto',
    margin: 'auto 5rem',
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: 'auto',
    gridGap: '30px',
    gridTemplateAreas: `
    'weeks weeks'
    'months months'
    'years years'`,
  },
};

const Packs = ({ classes, theme, setHeaderContent }) => {
  const [selectedPack, setSelected] = useState(null);

  const setSelectedPack = selection => setSelected({ ...selectedPack, ...selection });

  useEffect(() => {
    if (selectedPack) {
      selectedPack.header && setHeaderContent(selectedPack.header);
    } else {
      setHeaderContent(<p>yaa</p>);
    }
    return () => selectedPack || setHeaderContent(null);
  }, [selectedPack]);

  if (selectedPack) {
    return <BeatmapPackDetail pack={selectedPack.pack} select={setSelectedPack} />;
  }

  return (
    <>
      <div>
        <h2>Welcome to the packs section</h2>
        <h5>
          Here you will find collections of all ranked beatmaps grouped by mode for the last weeks, months and years
        </h5>
      </div>
      <div className={classes.Packs}>
        <div style={{ gridArea: 'weeks' }}>
          <Group name="Last weeks" packs={weekly} theme={theme} select={setSelectedPack} />
        </div>
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

export default injectSheet(styles)(Packs);
