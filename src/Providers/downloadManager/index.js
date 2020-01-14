/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React, { Component, useContext, createContext } from 'react';
import { remote, shell } from 'electron';
import { connect } from 'react-redux';
import { join } from 'path';
import { download, setSavePath, cancel, cancelCurrent, pause, pauseResume, clearQueue } from './ipc/send';
import { onDownloadProgress, onDownloadPaused, onQueueUpdate } from './ipc/listeners';

export const DownloadManagerContext = createContext();
export const useDownloadQueue = () => useContext(DownloadManagerContext);

// const { download } = remote.require('electron-download-manager');
const { app } = remote;

class DownloadManagerProvider extends Component {
  constructor(props) {
    super(props);
    onDownloadProgress(this.updateCurrentDowload.bind(this));
    onDownloadPaused(this.downloadPaused.bind(this));
    onQueueUpdate(this.updateQueue.bind(this));
    this.state = {
      queue: [],
      currentDownload: {},
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

  componentDidMount() {
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

  updateQueue(newQueue) {
    this.setState(prevState => ({ ...prevState, queue: newQueue }));
  }

  updateCurrentDowload(item) {
    this.state(prevState => ({ ...prevState, currentDownload: { ...item, status: 'downloading' } }));
  }

  downloadPaused() {
    this.state(prevState => ({ ...prevState, currentDownload: { ...prevState.currentDownload, status: 'paused' } }));
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
