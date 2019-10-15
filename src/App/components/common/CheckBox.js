import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  CheckBox: {
    margin: 'auto 0',
  },
  input: {
    '-webkit-appearance': 'none',
    border: `1px solid #2a2a2a`,
    verticalAlign: 'middle',
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: 'transparent',
    '&:checked': {
      border: ({ theme }) => `1px solid ${theme.color}`,
      backgroundColor: props => props.theme.color,
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

export default injectSheet(styles)(CheckBox);
