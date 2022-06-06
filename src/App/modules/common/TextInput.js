import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyle = createUseStyles({
  TextInput: {
    padding: '2px 10px 3px',
    lineHeight: '22px',
    border: '2px solid rgba(255, 255, 255, 0.41)',
    backgroundColor: 'transparent',
    color: ({ theme }) => (theme.dark ? 'white' : 'black'),
    transition: '240ms border, 100ms backgroundColor, 100ms color',
    '&:focus': {
      outline: 'none !important',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: ({ theme }) => theme.palette.primary.accent,
      backgroundColor: ({ theme }) => (theme.dark ? 'white' : 'black'),
      color: 'black',
    },
    '&:hover': {
      outline: 'none !important',
      border: '2px solid white',
    },
  },
});

const TextInput = ({ type, placeholder, value, onChange, onKeyDown, onBlur, ...otherProps }) => {
  const theme = useTheme();
  const classes = useStyle({ theme });
  return (
    <input
      className={`${classes.TextInput} textInput`}
      type={type || 'text'}
      placeholder={placeholder || ''}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      {...otherProps}
    />
  );
};

export default TextInput;
