import React from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import config from '../../../../../shared/config';

const useStyle = createUseStyles({
  a: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'rgb(255, 255, 255)',
    letterSpacing: '0.4pt',
    fontSize: '15px',
    padding: '0px 16px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    '&:hover .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:hover .tooltiptext': {
      visibility: props => (props.expended ? 'hidden' : 'visible'),
    },
  },
  i: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    margin: 0,
    height: props => (props.selected ? '40px' : '0px'),
    width: '3px',
    backgroundColor: ({ theme }) => theme.palette.primary.accent,
    transition: `height ${config.display.defaultTransitionDuration}`,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
  },
});

const Tab = ({ icon, title, onSelect, ...otherProps }) => {
  const theme = useTheme();
  const classes = useStyle({ ...otherProps, theme });
  return (
    <a data-radium="true" className={classes.a} onClick={onSelect} role="tab">
      <div className={`${classes.indicator} indicator`} />
      <i data-radium="true" className={classes.i}>
        {icon}
      </i>
      <span data-radium="true" className={classes.title}>
        {title}
      </span>
      {/* </span> */}
    </a>
  );
};

export default Tab;
