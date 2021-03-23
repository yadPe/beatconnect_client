import React from 'react';
import { createUseStyles } from 'react-jss';

import Nav from './modules/Nav';
import TitleBar from './modules/common/TitleBar.bs';
import config from '../shared/config';
import { getAppear } from './helpers/css.utils';
import AutoUpdater from './modules/AutoUpdater';
import { useOsuDbAutoScan } from './modules/Settings/utils/useScanOsuSongs';

const useStyles = createUseStyles({
  ...getAppear(),
  App: {
    '-webkit-font-smoothing': 'antialiased',
    userSelect: 'none',
    margin: 0,
    fontFamily: `"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif`,
  },
  appContentWrapper: {
    animation: '500ms ease-in forwards $appear',
    overflow: 'hidden',
  },
});

const App = () => {
  const classes = useStyles();
  useOsuDbAutoScan();

  return (
    <>
      <AutoUpdater />
      <div className={classes.App}>
        <TitleBar height={config.display.titleBarHeight} />
        <div className={classes.appContentWrapper}>
          <Nav />
        </div>
      </div>
    </>
  );
};

export default App;
