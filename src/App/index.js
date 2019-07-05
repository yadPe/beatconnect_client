import React from 'react';
import logo from './logo.svg';
import start from '../Bot';
import { connect } from 'react-redux';
import './App.css';

function App(props) {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and dab to reload.
        </p>
        <p>{props.mpMatchs[0] ? props.mpMatchs[0].getCurrentBeatmap() : 'idle'}</p>
        <button onClick={start}>Start</button>
        <button onClick={() => props.mpMatchs[0].start()} disabled={!props.mpMatchs.length > 0}>Start Match 0</button>
      </header>
    </div>
  );
}

const mapStateToProps = ({ mpMatchs }) => ({ mpMatchs });
export default connect(mapStateToProps)(App);
