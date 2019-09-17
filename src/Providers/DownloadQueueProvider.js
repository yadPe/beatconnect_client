import React, { Component } from 'react';
import { remote, shell } from 'electron';
import { connect } from 'react-redux';

export const DownloadQueueContext = React.createContext();

const { download } = remote.require("electron-download-manager");
const { app } = remote;

class DownloadQueueProvider extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      queue: [],
      currentDownload: {},
      overallProgress: 0,
      push: this.push,
      removeItemfromQueue: this.removeItemfromQueue,
      cancelDownload: this.cancelDownload,
      pauseDownload: this.pauseDownload,
      resumeDownload: this.resumeDownload
    }
  }

  componentDidMount() {
    const { importMethod, osuSongsPath } = this.props;
    this._setDlPath(importMethod, osuSongsPath)
  }

  componentDidUpdate(prevProps, prevState) {
    const { importMethod, osuSongsPath } = this.props;
    if (prevProps.importMethod !== importMethod || prevProps.osuSongsPath !== osuSongsPath) {
      this._setDlPath(importMethod, osuSongsPath)
    }
  }

  push = (item) => {
    const { queue } = this.state;
    if (queue.some(e => e.id === item.id)) return
    queue.push(item)
    console.log('QUEUE', queue)
    this.setState({ queue },
      () => {
        if (this.state.queue.length >= 1) {
          this._execQueue();
        }
      }
    )
  }

  removeItemfromQueue = (id) => {
    let { queue } = this.state;
    queue = queue.filter(item => item.id !== id);
    this.setState({ queue });
  }

  cancelDownload = () => {
    let { currentDownload } = this.state;
    if (!currentDownload.item) return
    currentDownload.item.cancel()
    this.downloading = false
    currentDownload = {};
    this.setState({ currentDownload },
      () => {
        if (this.state.queue.length !== 0) {
          this._execQueue();
        }
      }
    );
  }

  pauseDownload = () => {
    const { currentDownload } = this.state;
    currentDownload.item.pause()
  }

  resumeDownload = () => {
    const { currentDownload } = this.state;
    currentDownload.item.resume()
  }

  _execQueue = () => {
    let { queue, currentDownload } = this.state;
    if (this.downloading) return
    this.downloading = true;
    const { url, id, onFinished } = currentDownload.infos = queue.pop()
    this.setState({ currentDownload },
      () => download({ url, downloadFolder: this.dlPath, onProgress: this._onDownloadProgress }, (err, infos) => {
        if (err) {
          this._onDownloadFailed(err)
        } else {
          onFinished()
          this._onDownloadSucceed(infos, id)
        }
        currentDownload = {};
        this.downloading = false;
        queue = this.state.queue; // Check if queue was updated since we started dling
        this.setState({ queue, currentDownload },
          () => {
            if (this.state.queue.length !== 0) {
              this._execQueue();
            }
          }
        )
      })
    )
  }

  _onDownloadSucceed(infos, beatmapSetId) {
    const { importMethod } = this.props;
    if (importMethod === 'auto') {
      shell.openItem(infos.filePath)
    }

    /* TODO 
    * Sauvegarder l'id des beatmap telechargees
    * Ouvrir les beatmap seulement si l'option est active
    * mettre a jour l'indicateur de dl des beatmap
    */
    remote.getCurrentWindow().setProgressBar(-1)
    console.log('Finished dl', infos)
    console.log('QUEUE', this.state.queue)
  }

  _onDownloadFailed(err) {
    console.error(err)
  }

  _onDownloadProgress = (progress, item) => {
    let { overallProgress } = this.state;
    const { currentDownload, queue } = this.state;
    currentDownload.item = item;
    currentDownload.progress = progress;
    overallProgress = (progress.progress / 100) / (queue.length + 1);
    remote.getCurrentWindow().setProgressBar(overallProgress);
    this.setState({ currentDownload, overallProgress });
  }

  _setDlPath = (importMethod, osuSongsPath) => {
    if (importMethod === 'bulk') {
      this.dlPath = osuSongsPath
    } else {
      this.dlPath = app.getPath("downloads") + "\\beatconnect"
    }
  }

  render() {
    const { children } = this.props;
    return (
      <DownloadQueueContext.Provider value={this.state}>{children}</DownloadQueueContext.Provider>
    );
  }
}

const mapStateToProps = ({settings}) => {
  const { autoImport, importMethod, osuSongsPath } = settings.userPreferences;
  return { autoImport, importMethod, osuSongsPath } 
}
export default connect(mapStateToProps)(DownloadQueueProvider);
