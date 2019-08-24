import React from 'react';
import injectSheet from 'react-jss';

const style = {
  header: {
    position: 'relative',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    // font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif,
    fontSize: '15px',
    textTransform: 'uppercase',
    padding: '0px 24px',
    overflow: 'hidden',
    cursor: 'default',
    userSelect: 'none',
    color: props => props.theme.dark ? '#fff' : '#000'
  },
  divider: {
    margin: '0 10px',
    width: '1px',
    height: '80%',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: 'hsla(0,0%,100%,.1)',
  }
};
const Header = ({ title, classes, children }) => {
  return (
    <div className={classes.header}>
      <span data-radium="true">{title}</span>
      <div className={classes.divider}/>
      {children}
    </div>
  );
}

export default injectSheet(style)(Header);