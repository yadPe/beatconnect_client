import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Realm from 'realm';

import Nav from './modules/Nav';
import TitleBar from './modules/common/TitleBar.bs';
import config from '../shared/config';
import { getAppear } from './helpers/css.utils';
import AutoUpdater from './modules/AutoUpdater';
import useDeepLinking from './helpers/hooks/useDeepLinking';

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

const go = () => {
  const DogSchema = {
    name: 'Dog',
    properties: {
      _id: 'int',
      name: 'string',
      age: 'int',
    },
    primaryKey: '_id',
  };

  const configg = {
    path: 'my.realm',
    schema: [DogSchema],
  };

  const realm = new Realm(configg);
};

const App = () => {
  const classes = useStyles();
  useDeepLinking();
  // Already done by the PlayOsu component
  // useOsuDbAutoScan();

  useEffect(() => {
    go();
  }, []);

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
