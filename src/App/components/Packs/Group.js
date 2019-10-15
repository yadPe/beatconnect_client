import React from 'react';
import injectSheet from 'react-jss';
import BeatmapsPack from './BeatmapsPack/BeatmapsPack';

const styles = {
  Group: {},
};

const Group = ({ classes, classeName, name, packs, theme }) => {
  return (
    <div className={`${classes.Group} ${classeName}`}>
      <p>{name}</p>
      {packs.map(pack => (
        <BeatmapsPack pack={pack} theme={theme} />
      ))}
    </div>
  );
};

export default injectSheet(styles)(Group);
