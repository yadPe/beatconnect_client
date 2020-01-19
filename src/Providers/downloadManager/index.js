/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React, { Component, useContext, createContext } from 'react';
import { remote, ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { join } from 'path';
import { HistoryContext } from '../HistoryProvider';
import { download, setSavePath, cancel, cancelCurrent, pause, pauseResume, clearQueue } from './ipc/send';
import {
  onDownloadProgress,
  onDownloadPaused,
  onQueueUpdate,
  onDownloadSucceed,
  onDownloadManagerReady,
} from './ipc/listeners';
import config from '../../config';

export const DownloadManagerContext = createContext();
export const useDownloadQueue = () => useContext(DownloadManagerContext);

const { app } = remote;

class DownloadManagerProvider extends Component {
  static contextType = HistoryContext;

  constructor(props) {
    super(props);
    onDownloadManagerReady(this.initSaveLocation.bind(this));
    onDownloadProgress(this.updateCurrentDowload.bind(this));
    onDownloadPaused(this.downloadPaused.bind(this));
    onQueueUpdate(this.updateQueue.bind(this));
    onDownloadSucceed(this.downloadSucceeded.bind(this));
    this.state = {
      queue: [],
      currentDownload: { beatmapSetId: null, progressPercent: null, downloadSpeed: null, status: null },
      overallProgress: 0,

      pauseDownload: pause,
      pauseResumeDownload: pauseResume,
      cancelDownload: cancelCurrent,
      removeItemfromQueue: cancel,
      clear: clearQueue,

      setPath: this.setPath,
      push: download,
      pushMany: this.pushMany,
    };
  }

  initSaveLocation() {
    const { importMethod, osuSongsPath } = this.props;
    this.setPath(importMethod, osuSongsPath);
  }

  setPath = (importMethod, osuSongsPath) => {
    if (importMethod === 'bulk') {
      setSavePath(osuSongsPath);
    } else {
      setSavePath(join(app.getPath('downloads'), 'beatconnect'));
    }
  };

  updateQueue({ queue }) {
    this.setState(prevState => ({ ...prevState, queue, ...(!queue.length ? { currentDownload: null } : {}) }));
  }

  updateCurrentDowload(item) {
    this.setState(
      prevState => ({
        ...prevState,
        currentDownload: { ...item, status: config.download.status.downloading },
      }),
      () => console.log('updateCurrent', this.state),
    );
  }

  downloadPaused() {
    this.setState(prevState => ({
      ...prevState,
      currentDownload: { ...prevState.currentDownload, status: config.download.status.paused },
    }));
  }

  downloadSucceeded({ beatmapSetId }) {
    const {
      queue: [currentQueueItem],
    } = this.state;
    const { save } = this.context;

    if (beatmapSetId === currentQueueItem.beatmapSetId)
      save({ id: beatmapSetId, name: currentQueueItem.beatmapSetInfos.fullTitle });
  }

  render() {
    const { children } = this.props;
    return <DownloadManagerContext.Provider value={this.state}>{children}</DownloadManagerContext.Provider>;
  }
}

const mapStateToProps = ({ settings }) => {
  const { autoImport, importMethod, osuSongsPath } = settings.userPreferences;
  return { autoImport, importMethod, osuSongsPath };
};
export default connect(mapStateToProps)(DownloadManagerProvider);
