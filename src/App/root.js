import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '.';
import store from '../shared/store';
import * as serviceWorker from './serviceWorker';
import HistoryProvider from './Providers/HistoryProvider';
import DownloadManagerProvider from './Providers/downloadManager';
import AudioPlayerProvider from './Providers/AudioPlayerProvider';
import ErrorBoundary from './ErrorBoundary';
import TasksProvider from './Providers/TasksProvider';
import ThemeProvider from './Providers/ThemeProvider';

document.body.style.margin = 0;
ReactDOM.render(
  <ErrorBoundary>
    <HistoryProvider>
      <ThemeProvider>
        <Provider store={store}>
          <DownloadManagerProvider>
            <AudioPlayerProvider>
              <TasksProvider>
                <App />
              </TasksProvider>
            </AudioPlayerProvider>
          </DownloadManagerProvider>
        </Provider>
      </ThemeProvider>
    </HistoryProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
