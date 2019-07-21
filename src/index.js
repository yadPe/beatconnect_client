import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './store'
import * as serviceWorker from './serviceWorker';
import HistoryProvider from './HistoryProvider';

ReactDOM.render(
  <HistoryProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HistoryProvider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
