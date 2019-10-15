import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  Toggle: {
    position: 'relative',
    display: 'inline-block',
    width: props => props.width || '40px',
    height: props => props.height || '20px',
    borderRadius: '25px',
    margin: props => props.margin,
    // backgroundColor: '#989898',
    backgroundColor: props => (props.checked ? props.theme.color : props.background || '#2a2a2a'),
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
};

const Toggle = ({ classes, onChange, checked, disabled }) => {
  return (
    <label className={classes.Toggle}>
      <input className={classes.input} type="checkbox" onChange={onChange} checked={checked} disabled={disabled} />
      <div className={classes.div} />
    </label>
  );
};

export default injectSheet(styles)(Toggle);
