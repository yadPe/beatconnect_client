import { transitionDuration } from 'bs-css/src/Css.bs';
import React from 'react';
import { createUseStyles } from 'react-jss';

const colorByDifficulty = difficulty => {
  const map = {
    0: '#88b300',
    2: '#66ccff',
    2.7: '#ffcc22',
    4: '#ff66aa',
    5.3: '#8866ee',
    6.5: '#000',
  };
  const thresholds = Object.keys(map).sort((a, b) => b - a);
  const color = map[thresholds.find(threshold => threshold < difficulty)];
  console.log({ thresholds, color, difficulty });
  return color;
};

const useStyle = createUseStyles({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    width: '100%',
    height: '8px',
    '&:hover': {
      '&, & > .diff': {
        height: '15px',
      },
    },
    transition: 'height 200ms',
  },
  difficulty: {
    height: '4px',
    flexBasis: '100%',
    boxSizing: 'border-box',
    alignSelf: 'flex-end',
    flexShrink: '2',
    '& > .version': {
      visibility: 'hidden',
      transitionDelay: '200ms',
      transitionDuration: '100ms',
      transitionProperty: 'opacity',
      overflow: 'hidden',
      width: 0,
    },
    '&:hover': {
      // borderRight: '1px solid rgba(0,0,0,.4)',
      // borderLeft: '1px solid rgba(0,0,0,.4)',
      // flexBasis: '10000px',
      flexShrink: '1',

      height: '22px !important',
      '& > .version': {
        visibility: 'visible',
        width: 'auto',
      },
    },
    transition: 'all 200ms',
  },
});

const DifficultiesSelector = ({ beatmaps }) => {
  const classes = useStyle();
  return (
    <div className={classes.wrapper}>
      {beatmaps.map(beatmap => (
        <div
          className={`${classes.difficulty} diff`}
          style={{ backgroundColor: colorByDifficulty(beatmap.difficulty) }}
        >
          <div className="version">{beatmap.version}</div>
        </div>
      ))}
    </div>
  );
};

export default DifficultiesSelector;
