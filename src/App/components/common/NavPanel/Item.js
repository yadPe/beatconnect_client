import React, { useState } from 'react';
import injectSheet from 'react-jss';
import Header from './Header';
import config from '../../../../config';

const styles = {
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
    background: props => props.background,
    transition: 'background 0ms !important',

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
};

const Item = ({ classes, title, children, header, theme }) => {
  const [headerContent, setHeaderContent] = useState(null);

  return (
    <div className={classes.contentContainer}>
      <div className={classes.contentSubContainer}>
        <div>
          {header ? (
            <Header title={title} theme={theme}>
              {headerContent}
            </Header>
          ) : null}
        </div>
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

export default injectSheet(styles)(Item);
