import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  preloader: {
    display: 'inline-block',
    position: 'relative',
    width: ({ size }) => size,
    height: ({ size }) => size,
    '& div': {
      animation: '$lds-roller 1.2s cubic-bezier(.5, .05, .5, 1) infinite',
      transformOrigin: ({ size }) => `${size / 2}px ${size / 2}px`,
    },
    '& div:after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      width: ({ size }) => size * 0.09375,
      height: ({ size }) => size * 0.09375,
      borderRadius: '50%',
      background: ({ color }) => color,
      margin: ({ size }) => `-${size * 0.046875}px 0 0 -${size * 0.046875}px`,
    },
    '& div:nth-child(1)': {
      animationDelay: '-0.036s',
    },
    '& div:nth-child(1):after': {
      top: ({ size }) => size * 0.78125,
      left: ({ size }) => size * 0.78125,
    },
    '& div:nth-child(2)': {
      animationDelay: '-0.072s',
    },
    '& div:nth-child(2):after': {
      top: ({ size }) => size * 0.84375,
      left: ({ size }) => size * 0.703125,
    },
    '& div:nth-child(3)': {
      animationDelay: '-0.108s',
    },
    '& div:nth-child(3):after': {
      top: ({ size }) => size * 0.890625,
      left: ({ size }) => size * 0.609375,
    },
    '& div:nth-child(4)': {
      animationDelay: '-0.144s',
    },
    '& div:nth-child(4):after': {
      top: ({ size }) => size * 0.90625,
      left: ({ size }) => size * 0.5,
    },
    '& div:nth-child(5)': {
      animationDelay: '-0.18s',
    },
    '& div:nth-child(5):after': {
      top: ({ size }) => size * 0.890625,
      left: ({ size }) => size * 0.390625,
    },
    '& div:nth-child(6)': {
      animationDelay: '-0.216s',
    },
    '& div:nth-child(6):after': {
      top: ({ size }) => size * 0.84375,
      left: ({ size }) => size * 0.296875,
    },
    '& div:nth-child(7)': {
      animationDelay: '-0.252s',
    },
    '& div:nth-child(7):after': {
      top: ({ size }) => size * 0.78125,
      left: ({ size }) => size * 0.21875,
    },
    '& div:nth-child(8)': {
      animationDelay: '-0.288s',
    },
    '& div:nth-child(8):after': {
      top: ({ size }) => size * 0.703125,
      left: ({ size }) => size * 0.15625,
    },
  },

  '@keyframes lds-roller': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
};

const LoadingSpinner = ({ classes }) => {
  return (
    <div className={classes.preloader}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

LoadingSpinner.defaultProps = {
  size: 25,
  time: 3,
  color: '#fff',
};

export default InjectSheet(styles)(LoadingSpinner);
