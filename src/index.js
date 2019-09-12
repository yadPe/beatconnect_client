import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './store'
import * as serviceWorker from './serviceWorker';
import HistoryProvider from './Providers/HistoryProvider';
import DownloadQueueProvider from './Providers/DownloadQueueProvider'
import AudioPlayerProvider from './Providers/AudioPlayerProvider';
import ErrorBoundary from './ErrorBoundary';
import TasksProvider from './Providers/TasksProvider';

ReactDOM.render(
  <ErrorBoundary>
    <HistoryProvider>
      <Provider store={store}>
        <DownloadQueueProvider>
          <AudioPlayerProvider>
            <TasksProvider>
              <App />
            </TasksProvider>
          </AudioPlayerProvider>
        </DownloadQueueProvider>
      </Provider>
    </HistoryProvider>
  </ErrorBoundary>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
