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
      <p>To sync your osu! library go to the Settings section and register you song folder</p>
    </div>
  );
};

export default Empty;
