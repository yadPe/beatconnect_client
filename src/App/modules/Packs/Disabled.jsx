import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
  wrapper: {
    margin: '5rem',
  },
});

const Disabled = ({ status }) => {
  const classes = useStyle();

  return (
    <div className={classes.wrapper}>
      <h4>The bandwidth regulation police requested this feature to be momentarly disabled</h4>
      <h4>Pardon the inconvenience</h4>
    </div>
  );
};

export default Disabled;
