import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  wrapper: {
    position: 'relative',
  },
};

const BeatmapPackDetail = ({ classes }) => {
  return <div className={classes.wrapper}></div>;
};

export default InjectSheet(styles)(BeatmapPackDetail);
