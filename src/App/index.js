import React from 'react';
import logo from './logo.svg';
import start from '../Bot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and dab to reload.
        </p>
        <button onClick={start}>Start</button>
      </header>
    </div>
  );
}

export default App;
