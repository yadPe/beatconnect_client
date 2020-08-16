import React from 'react';
import { createUseStyles } from 'react-jss';

import Nav from './modules/Nav';
import TitleBar from './modules/common/TitleBar.bs';
import config from '../shared/config';

const useStyles = createUseStyles({
  App: {
    '-webkit-font-smoothing': 'antialiased',
    userSelect: 'none',
    margin: 0,
    fontFamily: `"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif`,
  },
  appContentWrapper: {
    // paddingTop: config.display.titleBarHeight,
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.App}>
      <TitleBar height={config.display.titleBarHeight} />
      <div className={classes.appContentWrapper}>
        <Nav />
      </div>
    </div>
  );
};

export default App;
