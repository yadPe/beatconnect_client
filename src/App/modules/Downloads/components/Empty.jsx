import React from 'react';
import { createUseStyles } from 'react-jss';
import renderIcons from '../../../helpers/renderIcons';

const useStyle = createUseStyles({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    fontSize: 'smaller',
    padding: '0 5rem',
  },
});

const Empty = () => {
  const classes = useStyle();
  return (
    <div className={classes.wrapper}>
      {renderIcons({ name: 'Download', height: '50px', width: '50px' })}
      <p>It&apos;s empty in here..</p>
      <p>
        Go and download some sweet beatmaps from the Beatmaps or Packs sections and they will show here while
        downloading!
      </p>
    </div>
  );
};

export default Empty;
