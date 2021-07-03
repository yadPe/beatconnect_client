import React, { useEffect, useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { debounce } from 'underscore';
import { getBeatmapDifficultyColorHex } from '../../../../shared/PpyHelpers.bs';

const DIFFICULTY_TRANSITION_DURATION = 160;
const VERSION_TRANSITION_DURATION = 100;

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
        transitionDelay: `${DIFFICULTY_TRANSITION_DURATION}ms`,
        transitionDuration: `${VERSION_TRANSITION_DURATION}ms`,
        transitionProperty: 'color',
        color: 'white',
        backdropFilter: 'brightness(0.9)',
      },
    },
    transition: `all ${DIFFICULTY_TRANSITION_DURATION}ms`,
  },
});

const DifficultiesSelector = ({ beatmaps, onSelect }) => {
  const [selectedDiff, setSelectedDiff] = useState(-1);
  const debounceOnSelect = useCallback(debounce(onSelect, DIFFICULTY_TRANSITION_DURATION), []);
  useEffect(() => {
    if (selectedDiff > -1) debounceOnSelect(selectedDiff);
    else debounceOnSelect.cancel();
  }, [selectedDiff]);
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
            style={{ backgroundColor: getBeatmapDifficultyColorHex(beatmap.difficulty) }}
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
