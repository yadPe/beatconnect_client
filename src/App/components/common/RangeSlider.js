import React, { useState } from 'react'
import injectSheet from 'react-jss';
import convertRange from '../../utils/convertRange';

const styles = {
  slider: {
    '-webkit-appearance': 'none',
    width: props => props.width || '100%',
    height: '10px',
    borderRadius: '5px',
    //background: '#d7dcdf',
    outline: 'none',
    padding: 0,
    margin: 0,
    background: props => `linear-gradient(90deg, ${props.theme.color} ${convertRange(props.value, props.min, props.max, 0, 100)}%, #3a3a3a ${convertRange(props.value, props.min, props.max, 0, 100)}%)`,
    '&::-webkit-slider-thumb': {

      appearance: 'none',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: props => props.theme.secondary || '#2a2a2a',
      cursor: 'pointer',
      transition: 'background .15s ease-in-out',

      '&:hover': {
        background: props => props.theme.color,
      }
    },
    '&:active::-webkit-slider-thumb': {
      background: props => props.theme.color,
    },
    '&:focus::-webkit-slider-thumb': {
      //boxShadow: props => `0 0 0 3px #2a2a2a, 0 0 0 6px ${props.theme.color}`,
    }
  }
};

const RangeSlider = ({ classes, value, min, max, onChange }) => {
  return (
    <input className={classes.slider} type="range" value={value} min={min} max={max} onChange={onChange} />
  );
}

export default injectSheet(styles)(RangeSlider);