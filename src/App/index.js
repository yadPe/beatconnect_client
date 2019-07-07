import React from 'react';
import Nav from './components/Nav'
import { connect } from 'react-redux';
import { TitleBar } from 'react-desktop/windows'
import { remote } from 'electron';
import './App.css';

const App = ({theme}) => {
  const window = remote.getCurrentWindow();

  return (
    <div className="App">
      <TitleBar 
      title={theme.title} 
      theme={theme.style}
      controls 
      onCloseClick={() => window.close()} 
      onMaximizeClick={() => window.isMaximized() ? window.unmaximize() : window.maximize()}
      onMinimizeClick={() => window.minimize()}
      onMouseDown={() => window.setOpacity(0.70)}
      onMouseUp={() => window.setOpacity(1)}
      />
      <Nav/>
    </div>
  );
}

const mapStateToProps = ({ theme }) => ({ theme });
export default connect(mapStateToProps)(App);
