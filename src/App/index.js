import React from 'react';
import { remote } from 'electron';
import { useTheme } from 'theming';
import Nav from './components/Nav';
import TitleBar from './components/common/TitleBar.bs';
import config from '../config';
import './App.css';

const App = () => {
  const window = remote.getCurrentWindow();
  const theme = useTheme();

  const onMaximizeClick = () => (window.isMaximized() ? window.unmaximize() : window.maximize());

  const onCloseClick = window.close;
  const onMinimizeClick = window.minimize;

  return (
    <>
      <TitleBar
        title={theme.title}
        theme={theme.style}
        height={config.display.titleBarHeight}
        controls
        onCloseClick={window.close}
        onMaximizeClick={onMaximizeClick}
        onMinimizeClick={window.minimize}
      />
      <Nav />
    </>
  );
};

export default App;
