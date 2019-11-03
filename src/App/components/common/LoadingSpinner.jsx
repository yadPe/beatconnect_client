import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  preloader: {
    display: 'inline-block',
    position: 'relative',
    width: '64px',
    height: '64px',
    '& div': {
      animation: 'lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      transformOrigin: '32px 32px',
    },
    '& div:after': {
      content: ' ',
      display: 'block',
      position: 'absolute',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#fff',
      margin: '-3px 0 0 -3px',
    },
    '& div:nth-child(1)': {
      animationDelay: '-0.036s',
    },
    '& div:nth-child(1):after': {
      top: '50px',
      left: '50px',
    },
    '& div:nth-child(2)': {
      animationDelay: '-0.072s',
    },
    '& div:nth-child(2):after': {
      top: '54px',
      left: '45px',
    },
    '& div:nth-child(3)': {
      animationDelay: '-0.108s',
    },
    '& div:nth-child(3):after': {
      top: '57px',
      left: '39px',
    },
    '& div:nth-child(4)': {
      animationDelay: '-0.144s',
    },
    '& div:nth-child(4):after': {
      top: '58px',
      left: '32px',
    },
    '& div:nth-child(5)': {
      animationDelay: '-0.18s',
    },
    '& div:nth-child(5):after': {
      top: '57px',
      left: '25px',
    },
    '& div:nth-child(6)': {
      animationDelay: '-0.216s',
    },
    '& div:nth-child(6):after': {
      top: '54px',
      left: '19px',
    },
    '& div:nth-child(7)': {
      animationDelay: '-0.252s',
    },
    '& div:nth-child(7):after': {
      top: '50px',
      left: '14px',
    },
    '& div:nth-child(8)': {
      animationDelay: '-0.288s',
    },
    '& div:nth-child(8):after': {
      top: '45px',
      left: '10px',
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
  size: 100,
  time: 3,
  color: '#fff',
};

export default InjectSheet(styles)(LoadingSpinner);
