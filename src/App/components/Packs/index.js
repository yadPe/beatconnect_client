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
    <div className={classes.Packs} style={{ gridArea: 'year' }}>
      <Group name="Pack of the month" packs={[testPack]} theme={theme} />
    </div>
  );
};

export default injectSheet(styles)(Packs);
