import React from 'react';
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withTheme } from 'theming';

const styles = {
  CheckBox: {
    margin: 'auto 0',
  },
  input: {
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
const CheckBox = ({ classes, checked, onChange, disabled }) => {
  return (
    <div className={classes.CheckBox}>
      <input
        className={classes.input}
        type="checkbox"
        checked={checked}
        // onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default compose(
  withTheme,
  injectSheet(styles),
)(CheckBox);
