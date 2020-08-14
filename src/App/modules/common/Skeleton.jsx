import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  '@keyframes color': {
    '10%': {
      backgroundColor: '#5c5c5c',
    },
    '50%': {
      backgroundColor: '#7d7d7d',
    },
    '90': {
      backgroundColor: '#5c5c5c',
    },
  },
  skeleton: {
    background: '#5c5c5c',
    borderColor: '#D8D8D8',
    position: 'relative',
    overflow: 'hidden',
    animationName: '$color',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationDelay: props => `0.${props.delay}s`,
  },
};

const Skeleton = ({ style, className, classes, ...otherProps }) => (
  <div className={`${classes.skeleton} ${className}`} style={style} {...otherProps} />
);

export default injectSheet(styles)(Skeleton);
