import React from 'react';
import injectSheet from 'react-jss';
import BeatmapsPack from './BeatmapsPack';

const styles = {
  Group: {},
  wrapper: {
    // width: 'min(calc(100% / 180) * 180)',
    overflowX: 'scroll',
    scrollSnapType: 'madatory',
    '&::-webkit-scrollbar': {
      width: '0px',
    },
  },
  packsContainer: {
    minWidth: 'max-content',
    minHeight: '200px',
    // display: 'flex',

    // minWidth: 'min-content',
  },
  packs: {
    // display: 'flex',
    flex: 1,
    // overflow: 'auto',
  },
};

const Group = ({ classes, classeName, name, packs, theme }) => {
  console.log(packs);
  return (
    <div className={`${classes.Group} ${classeName}`}>
      <h3>{name}</h3>
      <div className={classes.wrapper}>
        <div className={classes.packsContainer}>
          {/* <div className={classes.packs}> */}
          {packs.map(pack => (
            <BeatmapsPack pack={pack} theme={theme} />
          ))}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default injectSheet(styles)(Group);
