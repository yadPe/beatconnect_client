import React, { useContext } from 'react';
import InjectSheet from 'react-jss';
import { HistoryContext } from '../../../../Providers/HistoryProvider';
import reqImgAssets from '../../../utils/reqImgAssets';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';

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

const getColors = () => {
  const palettes = [
    ['#BF4974', '#8C3F63', '#8F94A6', '#132B40', '#D9A566'],
    ['#061426', '#474F59', '#1E3040', '#BFBFAA', '#737158'],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  return {
    weekly: { firstItem: palette[0], other: palette[3] },
    monthly: { firstItem: palette[1], other: palette[2] },
    yearly: { firstItem: palette[2], other: palette[4] },
  };
};

const colors = getColors();

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
    cursor: 'pointer',
    '&:hover, &:hover .hoverFilter, &:hover .downloadButton': {
      opacity: 1,
    },
    '& > *': {
      textTransform: 'uppercase',
      display: 'inline-block',
      'mix-blend-mode': 'difference',
      position: 'absolute',
      margin: 0,
    },
    '& > .status': {
      fontWeight: 700,
      fontStyle: 'italic',
      top: '40%',
      left: '35px',
    },
    '& > .beatmapsCount': {
      fontWeight: 700,
      fontSize: '10pt',
      bottom: '5px',
      left: '10px',
    },
    '& > .modeIco': {
      height: '80px',
      width: '80px',
      bottom: '40%',
      right: '30px',

      backgroundImage: ({ pack }) => `url(${reqImgAssets(`./mode_${pack.mode}.png`)})`,
      backgroundSize: 'cover',
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
    '& > .periodTitle': {
      '-webkit-text-fill-color': 'transparent',
      '-webkit-text-stroke-width': '1px',
      '-webkit-text-stroke-color': 'white',
      top: '22%',
      left: '13%',
      fontSize: '35px',
      fontWeight: 700,
    },
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
  completedFilter: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1,
    mixBlendMode: 'color',
  },
  completed: {
    opacity: 0.5,
  },
  hoverFilter: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(170deg, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.1) 38%, rgba(0,0,0,0) 100%)`,
    opacity: 0,
    mixBlendMode: 'normal',
    pointerEvents: 'none',
    '&:hover': {
      opacity: 1,
    },
  },
  downloadButton: {
    opacity: 0,
    bottom: 25,
    right: 25,
    backgroundColor: 'rgba(0, 0, 0, .35)',
    padding: '10px',
    borderRadius: '50%',
    mixBlendMode: 'normal',
    '&:hover': {
      padding: '11px',
    },
  },
};

const BeatmapsPack = ({ classes, pack: { beatmapsets, name, type }, index, select }) => {
  const packNumber = (name.match(/#\S+/g) || name.match(/20\S+/g)).toString();
  const periodTitle = type === 'monthly' ? months[packNumber.substr(1).replace(/^0+(?!$)/, '')] : packNumber;
  const history = useContext(HistoryContext);
  // const ownedBeatmapsPercentage = 100;
  const ownedBeatmapsPercentage = Math.floor(
    (beatmapsets.filter(beatmap => history.contains(beatmap.id)).length / beatmapsets.length) * 100,
  );
  const completed = ownedBeatmapsPercentage === 100;
  const completedFilterStyle = completed ? classes.completedFilter : '';
  const completedWrapperStyle = completed ? classes.completed : '';
  // console.log(pack);
  const style =
    index === 0
      ? { backgroundColor: colors[type].firstItem }
      : {
          backgroundColor: colors[type].other,
        };

  const handleClick = () =>
    select({
      pack: { beatmapsets, name, type },
    });
  return (
    <div
      className={`${classes.pack} ${classes[type]} ${completedWrapperStyle}`}
      style={style}
      role="button"
      onClick={handleClick}
    >
      {type === 'weekly' && <p className="type">Week</p>}
      <p className="periodTitle" style={{ fontSize: `${periodTitle.length > 5 && 27}px` }}>
        {periodTitle}
      </p>
      <p className="status">Ranked</p>
      <p className="beatmapsCount">{`${beatmapsets.length} beatmaps`}</p>
      <p className={classes.percentOwned} title="Beatmap already owned">{`${ownedBeatmapsPercentage}%`}</p>
      <div className="modeIco" />
      <DownloadBeatmapBtn pack={beatmapsets} noStyle className={`${classes.downloadButton} downloadButton`} />
      <div className={completedFilterStyle} />
      <div className={`${classes.hoverFilter} hoverFilter`} />
    </div>
  );
};

export default InjectSheet(styles)(BeatmapsPack);
