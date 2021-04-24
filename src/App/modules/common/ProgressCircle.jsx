import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Container: {
    width: ({ size }) => `${size}px`,
    height: ({ size }) => `${size + 10}px`,
    margin:"auto",
  },
  ProgressCircle: {
    position: 'relative',
    '& .one, & .two, & .three, & .four, & .five': {
      position: 'absolute',
      top: ({ size }) => `calc(50% + ${size + 5}px)`,
      left: '50%',
      outline: 'none',
      boxSizing: 'border-box',
      border: ({ color }) => `1px solid ${color}`,
      borderRadius: '50%',
      transformOrigin: ({ size }) => `0 -${size/2}px`,
      opacity: 0,
      animation: '$progresscircle 2.5s ease-in-out infinite',
    },
    '& .one': { animationDelay: '0s' },
    '& .two': { animationDelay: '0.08s' },
    '& .three': { animationDelay: '0.2s' },
    '& .four': { animationDelay: '0.32s' },
    '& .five': { animationDelay: '0.45s' },
  },
  '@keyframes progresscircle': {
    '0%': { transform: "rotate(0deg)", opacity: "0" },
    '30%': { opacity: "0.75" },
    '50%': { opacity: "1" },
    '80%': { transform: "rotate(720deg)", opacity: "0" },
    '100%': { transform: "rotate(900deg)", opacity: "0" },
  },
});

const ProgressCircle = ({ size=17, color="white", className=""}) => {
  const classes = useStyles({ size, color });

  return (
    <div className={classes.Container + " " + className}>
      <div className={classes.ProgressCircle}>
        <span className="one"></span>
        <span className="two"></span>
        <span className="three"></span>
        <span className="four"></span>
        <span className="five"></span>
      </div>
    </div>
  );
};

export default ProgressCircle;
