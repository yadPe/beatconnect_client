import React from 'react';
import { remote } from 'electron';
import { useTheme, createUseStyles } from 'react-jss';
import Nav from './modules/Nav';
import TitleBar from './modules/common/TitleBar.bs';
import config from '../config';

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
    paddingTop: config.display.titleBarHeight,
  },
});

const App = () => {
  const window = remote.getCurrentWindow();
  const theme = useTheme();
  const classes = useStyles();

  const onMaximizeClick = () => (window.isMaximized() ? window.unmaximize() : window.maximize());
  const onCloseClick = () => window.close();
  const onMinimizeClick = () => window.minimize();

  return (
    <div className={classes.App}>
      <TitleBar
        title={theme.title}
        theme={theme.style}
        height={config.display.titleBarHeight}
        controls
        onCloseClick={onCloseClick}
        onMaximizeClick={onMaximizeClick}
        onMinimizeClick={onMinimizeClick}
      />
      <div className={classes.appContentWrapper}>
        <Nav />
      </div>
    </div>
  );
};

export default App;
