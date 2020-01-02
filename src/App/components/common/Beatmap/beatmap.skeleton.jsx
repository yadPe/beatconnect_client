import React from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import Skeleton from '../Skeleton';

const useStyle = createUseStyles({
  beatmap: {
    margin: '1.3vh auto',
    height: '222px',
    width: '90%',
    background: ({ theme }) => theme.palette.primary.main,
  },
  cover: {
    height: '130px',
    width: '100%',
  },
  text: {
    margin: '10px auto',
    height: '10px',
  },
  buttons: {
    margin: '15px auto 0 auto',
    height: '30px',
    width: '25%',
  },
});

const BeatmapSkeleton = ({ style }) => {
  const theme = useTheme();
  const classes = useStyle({ theme });
  return (
    <div style={style}>
      <div className={`${classes.beatmap} Beatmap`}>
        <Skeleton className={classes.cover} />
        <Skeleton className={classes.text} style={{ width: '9%' }} />
        <Skeleton className={classes.text} style={{ width: '16%' }} />
        <Skeleton className={classes.buttons} />
      </div>
    </div>
  );
};

export default BeatmapSkeleton;
