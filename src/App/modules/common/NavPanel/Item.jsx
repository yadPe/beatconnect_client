import React, { useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import Header from './Header';
import config from '../../../../shared/config';

const useStyle = createUseStyles({
  contentContainer: {
    height: `100vh`,
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
  },
  contentWrapper: {
    height: '100vh',
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    padding: '0px',
    paddingLeft: `${config.display.sidePanelCompactedLength}px`,
    background: ({ theme }) => theme.palette.primary.dark,
    textAlign: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    backgroundColor: ({ theme }) => theme.palette.primary.dark,
    textRendering: 'optimizelegibility',
    fontFamily: 'Open Sans, sans - serif',
    width: `calc(100vw - ${config.display.sidePanelCompactedLength}px)`,
    overflow: 'auto',
    '&, & *': {
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: ({ theme }) => theme.palette.primary.accent,
      },
    },
  },
});

const Item = ({ title, children, header }) => {
  const [headerContent, setHeaderContent] = useState(null);
  const theme = useTheme();
  const classes = useStyle({ theme, hasHeader: !!header });

  return header ? (
    <div className={classes.contentContainer}>
      {header && <Header title={title}>{headerContent}</Header>}
      <div className={classes.contentWrapper}>
        <div id="modal-root" />
        {children(setHeaderContent)}
      </div>
    </div>
  ) : (
    <div className={classes.contentWrapper}>
      <div id="modal-root" />
      {children(setHeaderContent)}
    </div>
  );
};

Item.defaultProps = {
  title: '',
  background: '#000',
  padding: 0,
};

export default Item;
