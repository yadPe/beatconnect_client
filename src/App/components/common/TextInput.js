import React from 'react';
import injectSheet from 'react-jss'

const styles = {
  TextInput: {
    padding: '2px 10px 3px',
    lineHeight: '22px',
    border: '2px solid rgba(255, 255, 255, 0.41)',
    backgroundColor: 'transparent',
    color: 'white',
    transition: '240ms border, 100ms backgroundColor, 100ms color',
    '&:focus': {
      outline: 'none !important',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: props => props.color,
      backgroundColor: 'white',
      color: 'black',
    },
    '&:hover': {
      outline: 'none !important',
      border: '2px solid white',
    }
  }
}

const TextInput = ({ type, placeholder, value, onChange, classes }) => (
  <input className={classes.TextInput} type={type || 'text'} placeholder={placeholder || ''} value={value} onChange={onChange} />
);

export default injectSheet(styles)(TextInput);