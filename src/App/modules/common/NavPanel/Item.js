import React, { useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import Header from './Header';
import config from '../../../../shared/config';

const useStyle = createUseStyles({
  contentContainer: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
  },
  contentSubContainer: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
  },
  contentWrapper: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    padding: '0px',
    background: ({ theme }) => theme.palette.primary.dark,
    textAlign: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    backgroundColor: ({ theme }) => theme.palette.primary.dark,
    textRendering: 'optimizelegibility',
    fontFamily: 'Open Sans, sans - serif',
    height: `calc(100vh - ${config.display.titleBarHeight + config.display.topBarHeight}px)`,
    overflow: 'auto',
    '&, & *': {
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: ({ theme }) => theme.palette.primary.main,
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
  const classes = useStyle({ theme });

  return (
    <div className={classes.contentContainer}>
      <div className={classes.contentSubContainer}>
        {header ? <Header title={title}>{headerContent}</Header> : null}
        <div className={classes.contentWrapper}>
          <div id="modal-root" />
          {children(setHeaderContent)}
        </div>
      </div>
    </div>
  );
};

Item.defaultProps = {
  title: '',
  background: '#000',
  padding: 0,
};

export default Item;
