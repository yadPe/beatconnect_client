import React from 'react';
import injectSheet from 'react-jss';
import Group from './Group';
import testPack from './testPack';

const styles = {
  Packs: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
    'week month'
    'year year'
    'previous previous'`,
  },
};

const Packs = ({ classes, theme }) => {
  return (
    <>
      <div>
        <h2>Welcome to the packs section</h2>
        <h4>Here you will find collections of all ranked beatmaps grouped mode for the last weeks, months and years</h4>
      </div>
      <div className={classes.Packs} style={{ gridArea: 'year' }}>
        <Group name="Pack of the month" packs={[testPack]} theme={theme} />
      </div>
    </>
  );
};

export default injectSheet(styles)(Packs);
