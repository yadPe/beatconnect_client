import React from 'react';
import injectSheet from 'react-jss';
import Group from './Group';
import testPack from './testPack';

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

const Packs = ({ classes, theme }) => {
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
          <Group name="Last week" packs={testPack} theme={theme} />
        </div>
        <div style={{ gridArea: 'months' }}>
          <Group name="Past months" packs={testPack} theme={theme} />
        </div>
        <div style={{ gridArea: 'years' }}>
          <Group name="Past years" packs={testPack} theme={theme} />
        </div>
      </div>
    </>
  );
};

export default injectSheet(styles)(Packs);
