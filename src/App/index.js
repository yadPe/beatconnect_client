import React from 'react';
import { TitleBar } from 'react-desktop/windows';
import { remote } from 'electron';
import { useTheme } from 'theming';
import Nav from './components/Nav';
import './App.css';

const App = () => {
  const window = remote.getCurrentWindow();
  const theme = useTheme();

  return (
    <div className="App">
      <div className="TitleBar">
        <TitleBar
          title={theme.title}
          theme={theme.style}
          controls
          onCloseClick={() => window.close()}
          onMaximizeClick={() => (window.isMaximized() ? window.unmaximize() : window.maximize())}
          onMinimizeClick={() => window.minimize()}
        />
      </div>
      <div className="Nav">
        <Nav />
      </div>
    </div>
  );
};

export default App;
