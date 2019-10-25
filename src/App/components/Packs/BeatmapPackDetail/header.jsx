import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  wrapper: {
    display: 'inline-flex',
  },
};

const PackDetailHeader = ({ classes, pack: { beatmapsets, name, type } }) => {
  return (
    <div className={classes.wrapper}>
      <p>{name}</p>
      <p>{beatmapsets.length}</p>
    </div>
  );
};

export default InjectSheet(styles)(PackDetailHeader);
