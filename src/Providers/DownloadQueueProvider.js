import React, { Component } from 'react';
import { remote, shell } from 'electron';
//import { HistoryContext } from '../../Providers/HistoryProvider';

export const DownloadQueueContext = React.createContext();

class DownloadQueueProvider extends Component {
  //static contextType = HistoryContext;
  constructor(props) {
    super(props);
    this.download = remote.require("electron-download-manager").download;
    this.state = {
      queue: [],
      currentDownload: {},
      push: this.push,
      removeItemfromQueue: this.removeItemfromQueue,
      cancelDownload: this.cancelDownload,
      pauseDownload: this.pauseDownload,
      resumeDownload: this.resumeDownload
    }
  }

  push = (item) => {
    const { queue } = this.state;
    if (queue.some(e => e.id === item.id)) return
    queue.push(item)
    console.log('QUEUE', queue)
    this.setState({ queue },
      () => {
        if (this.state.queue.length === 1) {
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
      () => this.download({ url, onProgress: this._onDownloadProgress }, (err, infos) => {
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
    shell.openItem(infos.filePath)

    /* TODO 
    * Sauvegarder l'id des beatmap telechargees
    * Ouvrir les beatmap seulement si l'option est active
    * mettre a jour l'indicateur de dl des beatmap
    */
    console.log('Finished dl', infos)
    console.log('QUEUE', this.state.queue)
  }

  _onDownloadFailed(err) {
    console.error(err)
  }

  _onDownloadProgress = (progress, item) => {
    const { currentDownload } = this.state;
    currentDownload.item = item;
    currentDownload.progress = progress;
    console.log(currentDownload, 'progess', progress)
    this.setState({ currentDownload })
  }

  render() {
    const { children } = this.props;
    return (
      <DownloadQueueContext.Provider value={this.state}>{children}</DownloadQueueContext.Provider>
    );
  }
}


export default DownloadQueueProvider;
