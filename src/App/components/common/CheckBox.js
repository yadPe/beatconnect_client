import React from 'react';
import injectSheet, { withTheme } from 'react-jss';
import { compose } from 'redux';

const styles = {
  input: {
    margin: 'auto 1rem',
    '-webkit-appearance': 'none',
    border: ({ theme }) => `1px solid ${theme.palette.primary.main}`,
    verticalAlign: 'middle',
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: 'transparent',
    '&:checked': {
      border: ({ theme }) => `1px solid ${theme.palette.primary.accent}`,
      backgroundColor: ({ theme }) => theme.palette.primary.accent,
    },
  },
};
const CheckBox = ({ classes, checked, disabled }) => (
  <input className={classes.input} type="checkbox" checked={checked} disabled={disabled} />
);

export default compose(
  withTheme,
  injectSheet(styles),
)(CheckBox);
