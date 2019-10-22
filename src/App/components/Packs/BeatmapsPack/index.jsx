import React, { useContext } from 'react';
import InjectSheet from 'react-jss';
import { HistoryContext } from '../../../../Providers/HistoryProvider';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const styles = {
  pack: {
    marginRight: '1rem',
    display: 'inline-block',
    color: 'white',
    position: 'relative',
    backgroundColor: '#fffaf3',
    height: '180px',
    width: '180px',
    borderRadius: '4px',
    '&:hover': {},
    '&::after': {
      backgroundColor: '#000',
    },
    '& > *': {
      textTransform: 'uppercase',
      display: 'inline-block',
      'mix-blend-mode': 'difference',
      position: 'absolute',
      margin: 0,
    },
  },
  percentOwned: {
    fontSize: '15pt',
    margin: 0,
    bottom: 5,
    right: 5,
  },
  weekly: {
    '& > .periodTitle': {
      '-webkit-text-fill-color': 'transparent',
      '-webkit-text-stroke-width': '1px',
      '-webkit-text-stroke-color': 'white',
      fontWeight: 900,
      fontSize: '25pt',
      top: '23%',
      left: '15%',
    },
    '& > .type': {
      fontWeight: 800,
      top: '10%',
      left: '10px',
    },
  },
  monthly: {
    '& > .periodTitle': {},
  },
  yearly: {
    '& > .periodTitle': {
      '-webkit-text-fill-color': 'transparent',
      '-webkit-text-stroke-width': '1px',
      '-webkit-text-stroke-color': 'white',
      top: '17%',
      left: '13%',
      fontSize: '30pt',
      fontWeight: 700,
    },
  },
};

const BeatmapsPack = ({ classes, pack: { beatmapsets, name, type } }) => {
  console.log(type);
  const packNumber = (name.match(/#\S+/g) || name.match(/20\S+/g)).toString();
  // console.log(packNumber.substr(1).replace(/^0+(?!$)/, ''));
  const periodTitle = type === 'monthly' ? months[packNumber.substr(1).replace(/^0+(?!$)/, '')] : packNumber;
  const history = useContext(HistoryContext);
  const ownedBeatmapsPercentage = Math.round(
    beatmapsets.filter(beatmap => history.contains(beatmap.id)).length / beatmapsets.length,
  );
  // console.log(pack);
  return (
    <div className={`${classes.pack} ${classes[type]}`}>
      {type === 'weekly' && <p className="type">Week</p>}
      <p className="periodTitle">{periodTitle}</p>
      <p className={classes.percentOwned}>{`${ownedBeatmapsPercentage}`}%</p>
    </div>
  );
};

export default InjectSheet(styles)(BeatmapsPack);
