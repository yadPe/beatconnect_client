import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import convertRange from '../../helpers/convertRange';
import config from '../../../shared/config';

const useStyle = createUseStyles({
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
});

const RangeSlider = props => {
  const { value, min, max, onChange } = props;
  const theme = useTheme();
  const classes = useStyle({ ...props, theme });
  return <input className={classes.slider} type="range" value={value} min={min} max={max} onChange={onChange} />;
};

export default RangeSlider;
