import React from 'react';
import Nav from './components/Nav'
import { connect } from 'react-redux';
import { TitleBar } from 'react-desktop/windows'
import { remote } from 'electron';
import './App.css';

const App = ({ theme }) => {
  const window = remote.getCurrentWindow();

  return (
    <div className="App">
      <div className='TitleBar'>
        <TitleBar
          title={theme.title}
          theme={theme.style}
          controls
          onCloseClick={() => window.close()}
          onMaximizeClick={() => window.isMaximized() ? window.unmaximize() : window.maximize()}
          onMinimizeClick={() => window.minimize()}
        />
      </div>
      <div className='Nav'> 
        <Nav />
      </div>
    </div>
  );
}

const mapStateToProps = ({ main }) => ({ theme: main.theme });
export default connect(mapStateToProps)(App);
