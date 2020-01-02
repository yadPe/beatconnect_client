import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    userSelect: 'none',
    cursor: 'default',
    backgroundColor: ({ theme, color }) => color || theme.palette.primary.accent,
    outline: 'none',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: ({ theme, color }) => color || theme.palette.primary.accent,
    padding: '0 25px',
    lineHeight: ({ icon }) => !icon && '28px',
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
});

const Button = ({ className, ...props }) => {
  const theme = useTheme();
  const classes = useStyles({ ...props, theme });
  return <button className={`${classes.button} ${className}`} type="button" {...props} />;
};

export default Button;
