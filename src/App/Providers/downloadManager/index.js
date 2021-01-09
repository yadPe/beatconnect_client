/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React, { useContext, createContext, useState, useRef } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';

import { useDownloadHistory } from '../HistoryProvider';
import { downloadMany, download, setSavePath, cancel, cancelCurrent, pause, pauseResume, clearQueue } from './ipc/send';
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
  const stateRef = useRef(state);
  stateRef.current = state;

  const taskManager = useTasks();
  const downloadHistory = useDownloadHistory();

  const setPath = (importMethod, osuSongsPath) => {
    console.log('setPath', { importMethod, osuSongsPath });
    setSavePath({ path: osuSongsPath, importMethod });

    // if (importMethod === config.settings.importMethod.bulk && osuSongsPath) {
    //   setSavePath({ path: osuSongsPath, importMethod });
    // } else {
    //   setSavePath({
    //     path: app.getPath('downloads'),
    //     isAuto: importMethod === config.settings.importMethod.auto,
    //   });
    // }
  };

  const initSaveLocation = () => {
    const { importMethod, osuSongsPath } = props;
    setPath(importMethod, osuSongsPath);
  };

  const updateQueue = ({ queue }) => {
    const queueIsEmpty = !queue.length;

    if (queueIsEmpty) {
      taskManager.terminate('download');
      setState(prevState => ({ ...prevState, currentDownload: null }));
    } else if (!stateRef.current.queue.length) {
      taskManager.add({ name: 'download', status: 'running', description: 'initializing', section: 'Downloads' });
    }

    setState(prevState => ({ ...prevState, queue }));
  };

  const updateCurrentDowload = item => {
    setState(prevState => ({
      ...prevState,
      currentDownload: { ...item, status: config.download.status.downloading },
    }));
    taskManager.update({
      name: 'download',
      status: 'running',
      description: `${stateRef.current.currentDownload.progressPercent}% - ${stateRef.current.queue.length} items in queue`,
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
      description: `${stateRef.current.currentDownload.progressPercent}% (PAUSED) - ${stateRef.current.queue.length} items in queue`,
    });
  };

  const downloadSucceeded = ({ beatmapSetId }) => {
    const [currentQueueItem] = stateRef.current.queue;
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
    ...stateRef.current,
    pauseDownload: pause,
    pauseResumeDownload: pauseResume,
    cancelDownload: cancelCurrent,
    removeItemfromQueue: cancel,
    clear: clearQueue,
    push: download,

    setPath,
    pushMany: downloadMany,
  };
  const { children } = props;

  return <DownloadManagerContext.Provider value={value}>{children}</DownloadManagerContext.Provider>;
};

const mapStateToProps = ({ settings }) => {
  const { importMethod, osuSongsPath } = settings.userPreferences;
  return { importMethod, osuSongsPath };
};
export default connect(mapStateToProps)(DownloadManagerProvider);
