import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import renderIcons from '../../helpers/renderIcons';

const useStyle = createUseStyles({
  wrapper: {
    display: 'flex',
    alignSelf: 'center',
    padding: ({ hasLabel }) => (hasLabel ? '0.4rem' : '0.5rem'),
    border: ({ borderless }) => (borderless ? 'none' : 'white solid 3px'),
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: 'initial',
    transition: 'all 300ms',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.85)',
      color: 'rgba(255,255,255,0.85)',
      '& > svg *': {
        fill: 'rgba(255,255,255,0.85)',
      },
    },
  },
  label: {
    marginRight: '0.6rem',
  },
});

const NewButton = ({ onClick = () => {}, label = '', iconName = '', borderless = false }) => {
  const theme = useTheme();
  const classes = useStyle({ hasLabel: !!label, borderless, accentColor: theme.palette.primary.accent });
  return (
    <div className={classes.wrapper} onClick={onClick}>
      {label && <span className={classes.label}>{label}</span>}
      {iconName && renderIcons({ name: iconName })}
    </div>
  );
};

export default NewButton;
