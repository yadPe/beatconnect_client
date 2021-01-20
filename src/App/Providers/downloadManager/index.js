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
    beatmapSetsInQueue: [],
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
    setSavePath({
      path:
        importMethod === config.settings.importMethod.bulk && osuSongsPath ? osuSongsPath : app.getPath('downloads'),
      importMethod,
    });
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

    const beatmapSetsInQueue = stateRef.current.beatmapSetsInQueue.filter(item =>
      queue.some(itm => itm.beatmapSetId === item.id),
    );

    if (beatmapSetsInQueue.length < queue.length) {
      const filterMissingItem = item => !beatmapSetsInQueue.some(itm => itm.id === item.beatmapSetId);
      const mapQueueItemToPartialBeatmap = item => ({
        id: item.beatmapSetId,
        title: item.beatmapSetInfos.fullTitle,
      });

      const missingItems = queue.filter(filterMissingItem).map(mapQueueItemToPartialBeatmap);
      beatmapSetsInQueue.push(...missingItems);
    }

    setState(prevState => ({ ...prevState, queue, beatmapSetsInQueue }));
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

  const push = beatmapSet => {
    if (!stateRef.current.queue.some(item => item.beatmapSetId === beatmapSet.id)) {
      setState(prevState => ({ ...prevState, beatmapSetsInQueue: [...prevState.beatmapSetsInQueue, beatmapSet] }));
      download({
        beatmapSetId: beatmapSet.id,
        uniqId: beatmapSet.unique_id,
        beatmapSetInfos: { fullTitle: `${beatmapSet.title} - ${beatmapSet.artist}` },
      });
    }
  };

  const pushMany = items => {
    const itemsToAdd = items.filter(item => !stateRef.current.queue.some(itm => itm.beatmapSetId === item.id));
    setState(prevState => ({ ...prevState, beatmapSetsInQueue: [...prevState.beatmapSetsInQueue, ...itemsToAdd] }));

    downloadMany(
      itemsToAdd.map(({ unique_id, id, title, artist }) => ({
        beatmapSetId: id,
        uniqId: unique_id,
        beatmapSetInfos: { fullTitle: `${title} - ${artist}` },
      })),
    );
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
    push,
    pushMany,
    setPath,
  };
  const { children } = props;

  return <DownloadManagerContext.Provider value={value}>{children}</DownloadManagerContext.Provider>;
};

const mapStateToProps = ({ settings }) => {
  const { importMethod, osuSongsPath } = settings.userPreferences;
  return { importMethod, osuSongsPath };
};
export default connect(mapStateToProps)(DownloadManagerProvider);
