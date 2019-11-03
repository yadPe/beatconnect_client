import React from 'react';
import InjectSheet from 'react-jss';
import { compose } from 'redux';
import { withTheme } from 'theming';

const styles = {
  button: {
    userSelect: 'none',
    cursor: 'default',
    backgroundColor: ({ theme, color }) => color || theme.palette.primary.accent,
    outline: 'none',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: ({ theme, color }) => color || theme.palette.primary.accent,
    padding: '0 25px',
    lineHeight: '28px',
    fontSize: '15px',
    color: ({ theme }) => (theme.accentContrast === 'dark' ? '#fff' : '#000'),
    '&:hover': {
      borderColor: `rgba(0, 0, 0, .35)`,
    },
    '&:active': {
      opacity: 0.9,
    },
    '&:active svg': {
      transform: 'scale(.88)',
    },
    '& svg': {
      display: 'block',
      margin: '5px auto',
    },
  },
};

const Button = ({ classes, className, theme, ...props }) => {
  return <button className={`${classes.button} ${className}`} type="button" {...props} />;
};

export default compose(
  withTheme,
  InjectSheet(styles),
)(Button);
