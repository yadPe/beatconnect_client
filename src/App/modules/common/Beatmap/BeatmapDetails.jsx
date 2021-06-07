import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { make as Badge } from '../Badge.bs';
import DifficultiesSelector from './DifficultiesSelector';

const totalPlayCount = beatmaps => beatmaps.reduce((playcount, beatmap) => playcount + beatmap.playcount, 0);

const useStyle = createUseStyles({
  wrapper: {
    backdropFilter: 'saturate(150%) blur(5px) brightness(0.5)',
    height: '100%',
  },
});

const BeatmapDetails = ({ beatmapSet }) => {
  console.log(beatmapSet);
  const selectedDiff = useState('none');
  const classes = useStyle();
  return (
    <div className={classes.wrapper}>
      <Badge style={{ position: 'absolute', top: '.5rem', left: '.5rem' }} status={'ranked'} />
      {totalPlayCount(beatmapSet.beatmaps)}
      <br />
      {new Date(beatmapSet.ranked_date).toLocaleDateString()}
      <br />
      {beatmapSet.favourite_count}
      <DifficultiesSelector beatmaps={beatmapSet.beatmaps} />
    </div>
  );
};

export default BeatmapDetails;
