import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '.';
import store from '../shared/store';
import HistoryProvider from './Providers/HistoryProvider';
import DownloadManagerProvider from './Providers/downloadManager';
import ErrorBoundary from './ErrorBoundary';
import { make as TasksProvider } from './Providers/TaskProvider.bs';
import ThemeProvider from './Providers/ThemeProvider';
import { make as AudioPlayerProvider } from './Providers/AudioPlayer/Audioplayer.bs';
import dispatchOnResize from './resize';
import { makeServer } from '../mirage';

if (process.env.BEATCONNECT_CLIENT_MIRAGE === '1') {
  makeServer({ environment: 'development' });
}

dispatchOnResize();
document.body.style.margin = 0;

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
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
);
