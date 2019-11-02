import React from 'react';
import InjectSheet from 'react-jss';

const styles = {
  colorPicker: {
    '-webkit-appearance': 'none',
    border: 'none',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    '&::-webkit-color-swatch-wrapper': {
      padding: 0,
    },
    '&::-webkit-color-swatch': {
      border: 'none',
    },
  },
};

const ColorPicker = ({ classes, ...props }) => <input className={classes.colorPicker} type="color" {...props} />;

export default InjectSheet(styles)(ColorPicker);
