import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  Badge: {
    userSelect: 'none',
    boxSizing: 'border-box',
    // display: 'inline-block',
    display: 'inline-flex',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#2c3e50',
    color: '#fff',
    borderStyle: 'solid',
    borderRadius: '0.25rem',
    borderWidth: '2px',
    borderColor: '#2c3e50',
    textAlign: 'center',
    fontSize: '0.8rem',
    padding: '0.1rem 0.45rem 0.2rem',
    fontWeight: 400,
    lineHeight: 'inherit',
    transition: 'all 100ms',
    '&:hover': {
      cursor: 'default',
    },
  },
  info: {
    backgroundColor: '#3498db',
  },
  pending: {
    backgroundColor: 'rgba(241,196,15,0.15)',
    borderColor: 'rgba(241,196,15,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(241,196,15,0.4)',
      borderColor: 'rgba(241,196,15,1)',
    },
  },
  qualified: {
    backgroundColor: 'rgba(241,196,15,0.15)',
    borderColor: 'rgba(241,196,15,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(241,196,15,0.4)',
      borderColor: 'rgba(241,196,15,1)',
    },
  },
  graveyard: {
    backgroundColor: 'rgba(231,76,60,0.15)',
    borderColor: 'rgba(231,76,60,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(231,76,60,0.4)',
      borderColor: 'rgba(231,76,60,1)',
    },
  },
  WIP: {
    backgroundColor: 'rgba(231,76,60,0.15)',
    borderColor: 'rgba(231,76,60,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(231,76,60,0.4)',
      borderColor: 'rgba(231,76,60,1)',
    },
  },
  loved: {
    backgroundColor: 'rgba(222,90,148,0.15)',
    borderColor: 'rgba(222,90,148,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(222,90,148,0.4)',
      borderColor: 'rgba(222,90,148,1)',
    },
  },
  ranked: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderColor: 'rgba(46,204,113,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(46,204,113,0.4)',
      borderColor: 'rgba(46,204,113,1)',
    },
  },
};

const Badge = ({ classes, status }) => {
  return (
    <span className={`${classes.Badge} ${classes[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
  );
};

export default injectSheet(styles)(Badge);
