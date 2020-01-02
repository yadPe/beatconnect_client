import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles({
  Toggle: {
    position: 'relative',
    display: 'inline-block',
    width: props => props.width || '40px',
    height: props => props.height || '20px',
    borderRadius: '25px',
    margin: props => props.margin,
    // backgroundColor: '#989898',
    backgroundColor: ({ checked, theme, background }) =>
      checked ? theme.palette.primary.accent : background || theme.palette.primary.main,
    opacity: props => (props.disabled ? 0.5 : 1),
  },
  input: {
    display: 'none',
  },
  div: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: '#DFDFDF',
    transition: '.1s ease',
    width: '18px',
    height: '18px',
    top: '1px',
    left: props => (props.checked ? '50%' : '1px'),
  },
});

const Toggle = props => {
  const { onChange, checked, disabled } = props;
  const theme = useTheme();
  const classes = useStyles({ ...props, theme });
  return (
    <label className={classes.Toggle} htmlFor="checkBox">
      <input
        className={classes.input}
        id="checkBox"
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <div className={classes.div} />
    </label>
  );
};

export default Toggle;
