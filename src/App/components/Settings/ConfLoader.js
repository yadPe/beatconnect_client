import { readJSONSync, writeJSON } from 'fs-extra';
import { remote } from 'electron';
import baseConf from './baseConf'
import store from '../../../store';

class ConfLoader {
  constructor() {
    this.path = remote.app.getPath('documents') + '/Beatconnect/config.json';
    try {
      this.conf = readJSONSync(this.path)
    } catch (err) { // assume conf file does not exist 
      this.conf = baseConf
    }
  }

  save() {
    let { conf } = this;
    const { settings } = store.getState();
    conf = { ...conf, ...settings };
    this.conf = conf;
    writeJSON(this.path, this.conf, { EOL: '\n', spaces: 2 })
      .then(console.log('config daved!'))
      .catch(console.error)
  }
}

export default new ConfLoader();