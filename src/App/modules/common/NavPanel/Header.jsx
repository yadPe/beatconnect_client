import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import config from '../../../../shared/config';
import { getDragRegion } from '../../../helpers/css.utils';

const useStyle = createUseStyles({
  header: {
    ...getDragRegion(),
    position: 'absolute',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    textTransform: 'uppercase',
    padding: '0px 24px',
    marginLeft: '48px',
    overflow: 'hidden',
    cursor: 'default',
    userSelect: 'none',
    backdropFilter: 'saturate(180%) blur(5px)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottom: 'inset 1px hsla(0,0%,100%,0.1)',
    zIndex: 300,
    width: `calc(100% - ${config.display.sidePanelCompactedLength * 2}px)`,
    color: ({ theme }) => (theme.dark ? '#fff' : '#000'),
  },
  divider: {
    margin: '0 10px',
    width: '1px',
    height: '80%',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: 'hsla(0,0%,100%,.1)',
  },
});
const Header = ({ title, children }) => {
  const theme = useTheme();
  const classes = useStyle({ theme });
  return (
    <div className={classes.header}>
      <span data-radium="true">{title}</span>
      <div className={classes.divider} />
      {children}
    </div>
  );
};

export default Header;
