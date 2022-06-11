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
import RealmProvider from './Providers/RealmProvider';

if (process.env.BEATCONNECT_CLIENT_MIRAGE === '1') {
  makeServer({ environment: 'development' });
}

dispatchOnResize();
document.body.style.margin = 0;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <ThemeProvider>
      {/* <RealmProvider> */}
      <Provider store={store}>
        <HistoryProvider>
          <AudioPlayerProvider>
            <TasksProvider>
              <DownloadManagerProvider>
                <App />
              </DownloadManagerProvider>
            </TasksProvider>
          </AudioPlayerProvider>
        </HistoryProvider>
      </Provider>
      {/* </RealmProvider> */}
    </ThemeProvider>
  </ErrorBoundary>,
);
