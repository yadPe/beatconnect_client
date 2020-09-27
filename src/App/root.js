import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '.';
import store from '../shared/store';
import HistoryProvider from './Providers/HistoryProvider';
import DownloadManagerProvider from './Providers/downloadManager';
import ErrorBoundary from './ErrorBoundary';
import { make as TasksProvider } from './Providers/TaskProvider.bs';
import ThemeProvider from './Providers/ThemeProvider';
import { make as AudioPlayerProvider } from './Providers/AudioPlayerProvider.bs';
import dispatchOnResize from './resize';

dispatchOnResize();
document.body.style.margin = 0;
ReactDOM.render(
  <ErrorBoundary>
    <HistoryProvider>
      <ThemeProvider>
        <Provider store={store}>
          <AudioPlayerProvider>
            <TasksProvider>
              <DownloadManagerProvider>
                <App />
              </DownloadManagerProvider>
            </TasksProvider>
          </AudioPlayerProvider>
        </Provider>
      </ThemeProvider>
    </HistoryProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
