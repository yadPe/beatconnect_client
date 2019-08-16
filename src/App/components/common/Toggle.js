import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  Toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
    borderRadius: '25px',
    // backgroundColor: '#989898',
    backgroundColor: props => props.checked ? props.theme.color : '#2a2a2a',
  },
  input: {
    display: 'none'
  },
  div: {
    position: 'absolute',
    borderRadius: "50%",
    backgroundColor: '#DFDFDF',
    transition: '.1s ease',
    width: '18px',
    height: '18px',
    top: '1px',
    left: props => props.checked ? '50%' : '1px',
  }
};

const Toggle = ({ theme, classes, onChange, checked }) => {
  return (
    <label 
    className={classes.Toggle}
    >
      <input 
      className={classes.input} 
      type="checkbox"
      onChange={onChange}
      checked={checked}
      />
      <div className={classes.div} />
    </label>
  );
}

export default injectSheet(styles)(Toggle);