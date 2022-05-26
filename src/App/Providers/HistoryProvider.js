/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* Provides download history from {localUser}/Documents/Beatconnect/history.json */
import React, { Component, useContext, createContext } from 'react';
import { outputJSON, readJson } from 'fs-extra';
import { join } from 'path';
import { error, log } from 'electron-log';
import { memoize } from 'underscore';
import { getOsPath } from '../helpers/path';

export const HistoryContext = createContext();
export const useDownloadHistory = () => useContext(HistoryContext);

let memoizeCacheTimeMs = 0;
const hashFn = () => {
  const now = Date.now();
  const deltaT = now - memoizeCacheTimeMs < 5000;
  if (deltaT === false) {
    memoizeCacheTimeMs = now;
  }
  return String(memoizeCacheTimeMs);
};

class HistoryProvider extends Component {
  static historyFileMapper(beatmapSet) {
    if (Array.isArray(beatmapSet)) {
      const [beatmapSetId, beatmapsSetData] = beatmapSet;
      return {
        id: beatmapSetId,
        date: beatmapsSetData[0],
        title: beatmapsSetData[1],
        artist: beatmapsSetData[2],
        creator: beatmapsSetData[3],
        isUnplayed: beatmapsSetData[4],
        mapsMd5: beatmapsSetData[5],
        audioPath: beatmapsSetData[6],
        previewOffset: beatmapsSetData[7],
      };
    }
    if (typeof beatmapSet === 'object') {
      return [
        beatmapSet.id,
        [
          beatmapSet.date,
          beatmapSet.title,
          beatmapSet.artist,
          beatmapSet.creator,
          beatmapSet.isUnplayed,
          beatmapSet.mapsMd5,
          beatmapSet.audioPath,
          beatmapSet.previewOffset,
        ],
      ];
    }
    return beatmapSet;
  }

  constructor(props) {
    super(props);
    this.path = join(getOsPath('documents'), '/Beatconnect/history.json');
    this.state = {
      history: {},
      stats: {
        overallUnplayedCount: 0,
        overallDuration: 0,
      },
      ready: false,
      save: this.save,
      contains: this.contains,
      containsMD5: this.containsMD5,
      clear: this.clear,
      set: this.set,
    };
  }

  componentDidMount() {
    this._readHistory();
  }

  componentDidUpdate() {
    this._writeHistory();
  }

  static getHistoryValuesList = memoize(history => {
    return Object.values(history);
  }, hashFn);

  static getMD5BeatmapsetMap = memoize(history => {
    const historyValues = HistoryProvider.getHistoryValuesList(history);
    return historyValues.reduce((acc, item) => {
      if (Array.isArray(item?.mapsMd5)) {
        item.mapsMd5.forEach(mapMd5 => {
          acc[mapMd5] = item.id;
        });
      }
      return acc;
    }, {});
  }, hashFn);

  set = ({ beatmaps, overallDuration, overallUnplayedCount }) => {
    this.setState({ history: beatmaps, stats: { overallDuration, overallUnplayedCount } });
  };

  save = item => {
    const { id, artist, title, creator } = item;
    const { history } = this.state;
    history[id] = { id, artist, title, creator, date: Date.now() };
    this.setState({ history });
  };

  contains = id => {
    const { history } = this.state;
    return typeof history[id] !== 'undefined';
  };

  containsMD5 = md5 => {
    const { history } = this.state;
    const md5toId = HistoryProvider.getMD5BeatmapsetMap(history);
    return history[md5toId[md5]];
  };

  clear = () => {
    let { history } = this.state;
    history = {};
    this.setState({ history }, () => {
      this._writeHistory();
    });
  };

  _readHistory = () => {
    readJson(this.path)
      .then(rawHistory => {
        // Check if history is from a version prior to 0.3.0
        if (!Array.isArray(Object.values(rawHistory)[0])) {
          throw new Error('History file is deprecated recreating it');
        }
        const history = {};
        Object.entries(rawHistory).forEach(([id, data]) => {
          history[id] = HistoryProvider.historyFileMapper([id, data]);
        });
        console.log('_readHistory', { rawHistory, history });

        this.setState({ history }, this._setIsReady);
      })
      .catch(e => {
        error(e);
        this._createHistory(); // assume file does not exist
        this._setIsReady();
      });
  };

  _createHistory = () => {
    const { history } = this.state;
    outputJSON(this.path, history)
      .then(() => log('History Created!'))
      .catch(console.error);
  };

  _writeHistory = () => {
    const { history } = this.state;
    const rawHistory = Object.fromEntries(Object.values(history).map(HistoryProvider.historyFileMapper));
    console.log('_writeHistory', { history, rawHistory });
    outputJSON(this.path, rawHistory)
      .then(() => log('History saved!'))
      .catch(console.error);
  };

  _setIsReady() {
    this.setState(oldState => ({ ...oldState, ready: true }));
  }

  render() {
    const { children } = this.props;
    return <HistoryContext.Provider value={this.state}>{children}</HistoryContext.Provider>;
  }
}

export default HistoryProvider;
