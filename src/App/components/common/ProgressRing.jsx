import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  circle: {
    transition: 'stroke-dashoffset 0.35s',
    transform: 'rotate(-90deg)',
    transformOrigin: ' 50% 50%',
  },
};

const ProgressRing = ({ classes: { circle }, radius, stroke, progress, color }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        className={circle}
        stroke={color || 'white'}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default InjectSheet(styles)(ProgressRing);
