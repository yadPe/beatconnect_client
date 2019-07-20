import { remote, shell } from 'electron';


class DownloadManager {
  constructor() {
    this.queue = [];
    this.currentDownload = null;
    this.download = remote.require("electron-download-manager").download;
  }

  push(url, id) {
    this.queue.push({ url, id })
    if (this.queue.length === 0) {
      this._execQueue();
    }
  }

  removeItemfromQueue(id){
    this.queue = this.queue.filter(item => item.id !== id)
  }

  cancelDownload(){
    this.currentDownload.cancel()
  }

  pauseDownload(){
    this.currentDownload.pause()
  }
  
  resumeDownload(){
    this.currentDownload.resume()
  }

  _execQueue() {
    const { url } = this.queue.pop()
    this.download({ url, onProgress: this._onDownloadProgress }, (err, infos) => {
      if (err) {
        this._onDownloadFailed(err)
      } else {
        this._onDownloadSucceed(infos)
      }

      if (this.queue.length !== 0){
        this._execQueue();
      }
    })
  }

  _onDownloadSucceed(infos) {
    this.currentDownload = null;
    shell.openItem(infos.filePath)

    /* TODO 
    * Sauvegarder l'id des beatmap telechargees
    * Ouvrir les beatmap seulement si l'option est active
    * mettre a jour l'indicateur de dl des beatmap
    */
    console.log('Finished dl', infos)
  }

  _onDownloadFailed(err) {
    console.error(err)
  }

  _onDownloadProgress(progress, item) {
    this.currentDownload = item;
  }
}


export default new DownloadManager();
