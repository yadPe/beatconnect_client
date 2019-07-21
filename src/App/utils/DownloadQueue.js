import { remote, shell } from 'electron';
import { HistoryContext } from '../../HistoryProvider';


class DownloadQueue {
  //static contextType = HistoryContext;
  constructor() {
    this.queue = [];
    this.currentDownload = {};
    this.download = remote.require("electron-download-manager").download;
  }

  push(item) {
    this.queue.push(item)
    console.log('QUEUE', this.queue)
    if (this.queue.length === 1) {
      this._execQueue();
    }

  }

  removeItemfromQueue(id){
    this.queue = this.queue.filter(item => item.id !== id)
  }

  cancelDownload(){
    this.currentDownload.item.cancel() 
  }

  pauseDownload(){
    this.currentDownload.item.pause()
  }
  
  resumeDownload(){
    this.currentDownload.item.resume()
  }

  _execQueue() {
    if (typeof this.currentDownload.item !== 'undefined') return
    const { url, id, onFinished } =  this.currentDownload.infos = this.queue.pop()
    this.download({ url, onProgress: this._onDownloadProgress }, (err, infos) => {
      if (err) {
        this._onDownloadFailed(err)
      } else {
        onFinished()
        this._onDownloadSucceed(infos, id)
      }
      this.currentDownload = {};

      if (this.queue.length !== 0){
        this._execQueue();
      }
    })
  }

  _onDownloadSucceed(infos, beatmapSetId) {
    shell.openItem(infos.filePath)

    /* TODO 
    * Sauvegarder l'id des beatmap telechargees
    * Ouvrir les beatmap seulement si l'option est active
    * mettre a jour l'indicateur de dl des beatmap
    */
    console.log('Finished dl', infos)
    console.log('QUEUE', this.queue)
  }

  _onDownloadFailed(err) {
    console.error(err)
  }

  _onDownloadProgress = (progress, item) => {
    this.currentDownload.item = item;
    console.log(this.currentDownload, '[rogess', progress)
  }
}


export default new DownloadQueue();
