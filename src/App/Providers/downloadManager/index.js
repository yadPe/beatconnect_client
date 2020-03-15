/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React, { useContext, createContext, useState } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';

import { useDownloadHistory } from '../HistoryProvider';
import { download, setSavePath, cancel, cancelCurrent, pause, pauseResume, clearQueue } from './ipc/send';
import config from '../../../shared/config';
import { useTasks } from '../TaskProvider.bs';
import { useDownloadMangerIPC } from './ipc/listeners';

export const DownloadManagerContext = createContext();
export const useDownloadQueue = () => useContext(DownloadManagerContext);

const { app } = remote;

const DownloadManagerProvider = props => {
  const [state, setState] = useState({
    queue: [],
    currentDownload: { beatmapSetId: null, progressPercent: null, downloadSpeed: null, status: null },
    overallProgress: 0,
  });

  const taskManager = useTasks();
  const downloadHistory = useDownloadHistory();

  const setPath = (importMethod, osuSongsPath) => {
    if (importMethod === config.settings.importMethod.bulk && osuSongsPath) {
      setSavePath({ path: osuSongsPath });
    } else {
      setSavePath({
        path: app.getPath('downloads'),
        isAuto: importMethod === config.settings.importMethod.auto && config.settings.importMethod.auto,
      });
    }
  };

  const initSaveLocation = () => {
    const { importMethod, osuSongsPath } = props;
    setPath(importMethod, osuSongsPath);
  };

  const updateQueue = ({ queue }) => {
    const queueIsEmpty = !queue.length;
    if (queueIsEmpty) taskManager.terminate('download');
    else if (!state.queue.length)
      taskManager.add({ name: 'download', status: 'running', description: 'initializing', section: 'Downloads' });
    setState(prevState => ({ ...prevState, queue, ...(queueIsEmpty ? { currentDownload: null } : {}) }));
  };

  const updateCurrentDowload = item => {
    setState(prevState => ({
      ...prevState,
      currentDownload: { ...item, status: config.download.status.downloading },
    }));
    taskManager.update({
      name: 'download',
      status: 'running',
      description: `${state.currentDownload.progressPercent}% - ${state.queue.length} items in queue`,
    });
  };

  const downloadPaused = () => {
    setState(prevState => ({
      ...prevState,
      currentDownload: { ...prevState.currentDownload, status: config.download.status.paused },
    }));
    taskManager.update({
      name: 'download',
      status: 'suspended',
      description: `${state.currentDownload.progressPercent}% (PAUSED) - ${state.queue.length} items in queue`,
    });
  };

  const downloadSucceeded = ({ beatmapSetId }) => {
    const {
      queue: [currentQueueItem],
    } = state;
    const { save } = downloadHistory;

    if (beatmapSetId === currentQueueItem.beatmapSetId)
      save({ id: beatmapSetId, name: currentQueueItem.beatmapSetInfos.fullTitle });
  };

  useDownloadMangerIPC({
    onDownloadManagerReady: initSaveLocation,
    onDownloadProgress: updateCurrentDowload,
    onDownloadPaused: downloadPaused,
    onQueueUpdate: updateQueue,
    onDownloadSucceed: downloadSucceeded,
  });

  const value = {
    ...state,
    pauseDownload: pause,
    pauseResumeDownload: pauseResume,
    cancelDownload: cancelCurrent,
    removeItemfromQueue: cancel,
    clear: clearQueue,
    push: download,

    setPath,
    // pushMany,
  };
  const { children } = props;

  return <DownloadManagerContext.Provider value={value}>{children}</DownloadManagerContext.Provider>;
};

const mapStateToProps = ({ settings }) => {
  const { importMethod, osuSongsPath } = settings.userPreferences;
  return { importMethod, osuSongsPath };
};
export default connect(mapStateToProps)(DownloadManagerProvider);
