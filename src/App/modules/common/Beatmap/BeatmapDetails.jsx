import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { createUseStyles } from 'react-jss';
import renderIcons from '../../../helpers/renderIcons';
import timeSince, { secToMinSec } from '../../../helpers/timeSince';
import { make as Badge } from '../Badge.bs';
import DifficultiesSelector from './DifficultiesSelector';

const totalPlayCount = beatmaps => beatmaps.reduce((playcount, beatmap) => playcount + beatmap.playcount, 0);
const modes = mode => {
  const modesMap = Object.freeze({
    fruits: 'ctb',
    mania: 'mania',
    osu: 'std',
    taiko: 'taiko',
  });
  return modesMap[mode];
};

const useStyle = createUseStyles({
  wrapper: {
    backdropFilter: 'saturate(150%) blur(5px) brightness(0.5)',
    height: '100%',
    opacity: ({ isCardhovered }) => (isCardhovered ? 1 : 0),
    transition: 'opacity 150ms',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  topContainer: {
    display: 'inline-flex',
    width: '-webkit-fill-available',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '.5rem',
    height: ({ isCardhovered }) => (isCardhovered ? '26px' : '0'),
    transitionDelay: '50ms',
    transition: 'height 200ms',
  },
  leftContainer: {
    position: 'absolute',
    top: '45px',
    left: '1rem',
    display: 'inline-flex',
    flexDirection: 'column',
    textAlign: 'left',
    opacity: ({ isCardhovered }) => (isCardhovered ? 1 : 0),
  },
  rightContainer: {
    position: 'absolute',
    top: '45px',
    right: '1rem',
    display: 'inline-flex',
    flexDirection: 'column',
    textAlign: 'right',
    opacity: ({ noDiffSelectd }) => (noDiffSelectd ? 0 : 1),
  },
  versionTitle: {
    fontWeight: 600,
    fontSize: 'medium',
    opacity: ({ noDiffSelectd }) => (noDiffSelectd ? 0 : 1),
  },
  textElipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  details: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    opacity: ({ noDiffSelectd }) => (noDiffSelectd ? 0 : 1),
  },
  one: {
    transitionDelay: '250ms',
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
  },
  two: {
    transitionDelay: '50ms',
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
  },
  three: {
    transitionDelay: '100ms',
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
  },
  foor: {
    transitionDelay: '150ms',
    transitionDuration: '200ms',
    transitionProperty: 'opacity',
  },
  bold: {
    fontWeight: 600,
  },
});

const BeatmapDetails = ({ beatmapSet, cardRef }) => {
  const [selectedDiff, setSelectedDiff] = useState('none');
  const [isCardhovered, setIsCardhovered] = useState(false);
  const noDiffSelectd = selectedDiff === 'none';
  const classes = useStyle({ noDiffSelectd, isCardhovered });
  const onDiffSelect = useCallback(diffIndex => setSelectedDiff(beatmapSet.beatmaps[diffIndex] ?? 'none'), []);
  useEffect(() => {
    if (cardRef.current) {
      const leaveHandler = () => {
        setSelectedDiff('none');
        setIsCardhovered(false);
      };
      const enterHandler = () => {
        setIsCardhovered(true);
      };
      cardRef.current.addEventListener('mouseleave', leaveHandler);
      cardRef.current.addEventListener('mouseenter', enterHandler);
    }
  }, [cardRef.current]);
  useLayoutEffect(() => {
    if (cardRef.current && selectedDiff !== 'none') {
      const matchingModePill = cardRef.current.querySelector(`img.pill.${modes(selectedDiff.mode)}`);
      matchingModePill.classList.add('highlight');
      cardRef.current.querySelector('div.availableModes').classList.add('hasHighlight');

      return () => matchingModePill.classList.remove('highlight');
    }
    if (cardRef.current && selectedDiff === 'none') {
      cardRef.current.querySelector('div.availableModes').classList.remove('hasHighlight');
    }

    return () => {};
  }, [selectedDiff, cardRef.current]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.topContainer}>
        <Badge
          status={beatmapSet.status}
          difficulty={selectedDiff.difficulty}
          difficultyText={selectedDiff.difficulty && `☆ ${selectedDiff.difficulty}`}
        />
        <p
          className={`${classes.versionTitle} ${classes.two} ${classes.textElipsis}`}
          title={selectedDiff.version ?? 'Version'}
        >
          {selectedDiff.version ?? 'Version'}
        </p>
        <p style={{ flexGrow: 1 }} />

        <p className={`${classes.details} ${classes.foor}`} title="Circle count">
          {renderIcons({ name: 'Circle', width: '15px', height: '15px' })}
          <span>{selectedDiff.count_circles}</span>
        </p>
        <p className={`${classes.details} ${classes.three}`} title="Slider count">
          {renderIcons({ name: 'Slider', width: '15px', height: '15px' })}
          <span>{selectedDiff.count_sliders}</span>
        </p>
        <p className={`${classes.details} ${classes.two}`} title="Spinner count">
          {renderIcons({ name: 'Spinner', width: '14px', height: '14px' })}
          <span>{selectedDiff.count_spinners}</span>
        </p>
        <p
          className={`${classes.details} ${classes.one}`}
          style={{ opacity: isCardhovered ? 1 : 0 }}
          title="Duration in minutes"
        >
          {renderIcons({ name: 'Clock', width: '15px', height: '15px' })}
          <span>{secToMinSec(selectedDiff.total_length ?? beatmapSet.average_length)}</span>
        </p>
      </div>
      <div className={`${classes.leftContainer} ${classes.one}`}>
        <p title={new Date(beatmapSet.submitted_date).toLocaleString()}>
          <span>Submited </span>
          <span className={classes.bold}>{timeSince(new Date(beatmapSet.submitted_date))}</span>
        </p>
        <p title={new Date(beatmapSet.ranked_date).toLocaleString()}>
          <span>Ranked </span>
          <span className={classes.bold}>{timeSince(new Date(beatmapSet.ranked_date))}</span>
        </p>
        <p>
          <span>Play count </span>
          <span className={classes.bold}>
            {noDiffSelectd ? totalPlayCount(beatmapSet.beatmaps) : selectedDiff.playcount}
          </span>
        </p>
        <p>
          <span>Favorite count </span>
          <span className={classes.bold}>{beatmapSet.favourite_count}</span>
        </p>
      </div>
      <div className={`${classes.rightContainer} ${classes.two}`}>
        <p>
          <span className={classes.bold}>CS: </span>
          <span>{selectedDiff.cs}</span>
        </p>
        <p>
          <span className={classes.bold}>AR: </span>
          <span>{selectedDiff.ar}</span>
        </p>
        <p>
          <span className={classes.bold}>Drain: </span>
          <span>{selectedDiff.drain}</span>
        </p>
        <p>
          <span className={classes.bold}>Acc: </span>
          <span>{selectedDiff.accuracy}</span>
        </p>
      </div>

      <DifficultiesSelector beatmaps={beatmapSet.beatmaps} onSelect={onDiffSelect} />
    </div>
  );
};

export default BeatmapDetails;
