import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  '@keyframes shine': {
    from: {
      opacity: 0.5,
      left: '-100%',
    },

    to: {
      opacity: 1,
      left: '200%',
    },
  },
  skeleton: {
    background: '#5c5c5c',
    borderColor: '#D8D8D8',
    // display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',

    '&::after': {
      content: '',
      // display: 'block',
      position: 'absolute',
      top: '-125%',
      left: '-100%',
      width: '40px',
      height: '350%',
      opacity: 1,
      transform: 'rotate(45deg)',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0) 100%)',
      animation: 'shine',
      animationDuration: '4s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-out',
    },
  },
};

const Skeleton = ({ style, className, classes, ...otherProps }) => (
  <div className={`${classes.skeleton} ${className}`} style={style} {...otherProps} />
);

export default injectSheet(styles)(Skeleton);
