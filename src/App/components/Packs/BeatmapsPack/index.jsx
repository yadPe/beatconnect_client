import React, { useContext } from 'react';
import InjectSheet from 'react-jss';
import { HistoryContext } from '../../../../Providers/HistoryProvider';

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
  percentOwned: {
    margin: 0,
    position: 'absolute',
    bottom: 0,
    right: 3,
  },
};

const BeatmapsPack = ({ classes, pack: { beatmapsets, name, type } }) => {
  const packNumber = name.match(/#\S+/g) || name.match(/20\S+/g);
  const history = useContext(HistoryContext);
  const ownedBeatmapsPercentage = Math.round(
    beatmapsets.filter(beatmap => history.contains(beatmap.id)).length / beatmapsets.length,
  );
  // console.log(pack);
  return (
    <div className={classes.pack}>
      <p>{packNumber}</p>
      <p className={classes.percentOwned}>{`${ownedBeatmapsPercentage}`}%</p>
    </div>
  );
};

export default InjectSheet(styles)(BeatmapsPack);
