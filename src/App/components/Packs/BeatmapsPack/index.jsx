import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  pack: {
    marginRight: '1rem',
    display: 'inline-block',
    color: 'black',
    position: 'relative',
    backgroundColor: '#fffaf3',
    height: '180px',
    width: '180px',
    borderRadius: '4px',
    '&:hover': {},
    '&::after': {
      backgroundColor: '#000',
    },
  },
};

const BeatmapsPack = ({ classes, pack }) => {
  console.log(pack);
  return (
    <div className={classes.pack}>
      <p>{pack.name}</p>
    </div>
  );
};

export default InjectSheet(styles)(BeatmapsPack);
