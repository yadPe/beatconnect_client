import React from 'react';
import start from '../Bot';
import { connect } from 'react-redux';
import { TitleBar } from 'react-desktop/windows'
import { remote } from 'electron';
import './App.css';

function App(props) {
  const window = remote.getCurrentWindow();

  const { theme, title } = props.theme;
  return (
    <div className="App">
      <TitleBar 
      title={title} 
      theme={theme}
      controls 
      onCloseClick={() => window.close()} 
      onMaximizeClick={() => window.isMaximized() ? window.unmaximize() : window.maximize()}
      onMinimizeClick={() => window.minimize()}
      onMouseDown={() => window.setOpacity(0.70)}
      onMouseUp={() => window.setOpacity(1)}
      />
      <div className={'container'}>
        <p>{props.mpMatchs[0] ? props.mpMatchs[0].getCurrentBeatmap() : 'idle'}</p>
        <button onClick={start}>Start</button>
        <button onClick={() => props.mpMatchs[0].start()} disabled={!props.mpMatchs.length > 0}>Start Match 0</button>
      </div>
    </div>
  );
}

const mapStateToProps = ({ mpMatchs, theme }) => ({ mpMatchs, theme });
export default connect(mapStateToProps)(App);
