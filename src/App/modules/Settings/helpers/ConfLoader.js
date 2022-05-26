/* eslint-disable no-console */
import { readJSONSync } from 'fs-extra';
import fs from 'fs';
import { join } from 'path';
import { error, warn } from 'electron-log';
import baseConf from './baseConf';
import { getOsPath } from '../../../helpers/path';

class ConfLoader {
  constructor() {
    this.path = join(getOsPath('documents'), 'Beatconnect', 'config.json');
    this.conf = null;
  }

  get config() {
    try {
      const userConfig = readJSONSync(this.path);
      this.conf = { ...this.conf, ...userConfig };
      return this.conf;
    } catch (err) {
      warn('[Conf loader]: Failed to get user config creating a new one', err);
      this.conf = baseConf;
      return this.conf;
    }
  }

  async save(userSettings) {
    if (!this.conf) {
      console.log('Didnt save config cause its falsy');
      return;
    }
    this.conf = { ...this.conf, ...userSettings };
    try {
      const json = JSON.stringify(this.conf);
      fs.writeFileSync(this.path, json, { flag: 'w' });
      console.log('config daved!');
    } catch (e) {
      console.error('config ooofed!');
      error('[config loader]: failed to write use config');
    }
  }
}

const configLoader = new ConfLoader();
export default configLoader;
