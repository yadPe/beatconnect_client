import React from 'react';
import { useTheme, createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
  DropDown: {
    height: '30px',
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.35)',
    border: '2px solid rgba(255, 255, 255, 0.41)',
    margin: '0 5px 0 0',
    padding: '2px 0 4px 0',
    transition: '240ms border, 100ms backgroundColor, 100ms color',
    '&:focus': {
      outline: 'none !important',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: ({ theme }) => theme.palette.primary.accent,
      backgroundColor: 'white',
      color: 'black',
    },
    '&:hover': {
      outline: 'none !important',
      border: '2px solid white',
    },
  },
  option: {
    color: 'black',
  },
});

const DropDown = ({ className, options, onSelect, onBlur, value }) => {
  const theme = useTheme();
  const classes = useStyle({ theme });
  return (
    <select className={`${classes.DropDown} ${className}`} onChange={onSelect} onBlur={onBlur} value={value}>
      {options.map(([title, key]) => (
        <option key={key} className={classes.option} value={key}>
          {title}
        </option>
      ))}
    </select>
  );
};

export default DropDown;
