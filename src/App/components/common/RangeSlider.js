import React from 'react';
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withTheme } from 'theming';
import convertRange from '../../utils/convertRange';
import config from '../../../config';

const styles = {
  slider: {
    '-webkit-appearance': 'none',
    width: props => props.width || '100%',
    height: '10px',
    borderRadius: '5px',
    outline: 'none',
    padding: 0,
    margin: 0,
    background: props =>
      `linear-gradient(90deg, ${props.theme.palette.primary.accent} ${convertRange(
        props.value,
        props.min,
        props.max,
        0,
        100,
      )}%, #3a3a3a ${convertRange(props.value, props.min, props.max, 0, 100)}%)`,
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: ({ theme }) => theme.palette.primary.main,
      cursor: 'pointer',
      transition: `background ${config.display.defaultTransitionDuration} ease-in-out`,

      '&:hover': {
        background: ({ theme }) => theme.palette.primary.accent,
      },
    },
    '&:active::-webkit-slider-thumb': {
      background: ({ theme }) => theme.palette.primary.accent,
    },
  },
};

const RangeSlider = ({ classes, value, min, max, onChange }) => {
  return <input className={classes.slider} type="range" value={value} min={min} max={max} onChange={onChange} />;
};

export default compose(
  withTheme,
  injectSheet(styles),
)(RangeSlider);
