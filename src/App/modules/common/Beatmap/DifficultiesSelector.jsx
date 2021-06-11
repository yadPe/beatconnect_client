import React, { useState } from 'react';
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
    height: '25px',
    '&:hover': {
      '& > .diff': {
        height: '12px',
      },
    },
    transition: 'height 200ms',
    '& .prev': {
      height: '18px !important',
    },
  },
  difficulty: {
    height: '4px',
    flexBasis: '100%',
    boxSizing: 'border-box',
    alignSelf: 'flex-end',
    flexShrink: '2',
    minWidth: 0,
    '& > .version': {
      pointerEvents: 'none',
      overflow: 'hidden',
      height: '100%',
      color: 'transparent',
    },
    '&:hover': {
      '& + .diff': {
        height: '18px',
      },
      flexShrink: '1',
      height: '22px !important',
      '& > .version': {
        transitionDelay: '160ms',
        transitionDuration: '100ms',
        transitionProperty: 'color',
        color: 'white',
        backdropFilter: 'brightness(0.9)',
      },
    },
    transition: 'all 160ms',
  },
});

const DifficultiesSelector = ({ beatmaps }) => {
  const [selectedDiff, setSelectedDiff] = useState(-1);
  const classes = useStyle();
  return (
    <div className={classes.wrapper}>
      {beatmaps
        .sort((a, b) => a.difficulty - b.difficulty)
        .map((beatmap, i) => (
          <div
            onMouseLeave={() => {
              setSelectedDiff(-1);
            }}
            className={`${classes.difficulty} diff ${i === selectedDiff - 1 ? 'prev' : ''}`}
            style={{ backgroundColor: colorByDifficulty(beatmap.difficulty) }}
            onMouseEnter={() => {
              setSelectedDiff(i);
            }}
          >
            <div className="version">{beatmap.version}</div>
          </div>
        ))}
    </div>
  );
};

export default DifficultiesSelector;
