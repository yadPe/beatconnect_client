/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { remote, shell } from 'electron';
import { connect } from 'react-redux';
import { join } from 'path';
import { download, setSavePath, cancel, cancelCurrent, pause, pauseResume, clearQueue } from './ipc/send';
import { onDownloadProgress } from './ipc/listeners';

export const DownloadQueueContext = React.createContext();

// const { download } = remote.require('electron-download-manager');
const { app } = remote;

class DownloadQueueProvider extends Component {
  constructor(props) {
    super(props);
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
      push: this.push,
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
    this.state(prevState => ({ ...prevState, currentDownload: item }));
  }

  render() {
    const { children } = this.props;
    return <DownloadQueueContext.Provider value={this.state}>{children}</DownloadQueueContext.Provider>;
  }
}

const mapStateToProps = ({ settings }) => {
  const { autoImport, importMethod, osuSongsPath } = settings.userPreferences;
  return { autoImport, importMethod, osuSongsPath };
};
export default connect(mapStateToProps)(DownloadQueueProvider);
