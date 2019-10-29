import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  a: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
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
  span: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: '15px',
    letterSpacing: '0.4pt',
    padding: '0px 16px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
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
    transition: `all 100ms`,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
  },
  tooltiptext: {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: '6px',
    position: 'absolute',
    left: '105%',
    zIndex: 1,
  },
};

const Tab = ({ classes, selected, icon, title, onSelect }) => {
  return (
    <a data-radium="true" className={classes.a} onClick={onSelect}>
      <span className={`${classes.tooltiptext} tooltiptext`}>{title}</span>
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <i data-radium="true" className={classes.i}>
          {icon}
        </i>
        <span data-radium="true" className={classes.title}>
          {title}
        </span>
      </span>
    </a>
  );
};

export default injectSheet(styles)(Tab);
