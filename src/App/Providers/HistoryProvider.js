/* eslint-disable no-underscore-dangle */
/* Provides download history from {localUser}/Documents/Beatconnect/history.json */
import React, { Component, useContext, createContext } from 'react';
import { remote } from 'electron';
import { outputJSON, readJson } from 'fs-extra';
import { join } from 'path';
import { error, log } from 'electron-log';

export const HistoryContext = createContext();
export const useDownloadHistory = () => useContext(HistoryContext);

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
        md5: beatmapsSetData[5],
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
          beatmapSet.md5,
          beatmapSet.audioPath,
          beatmapSet.previewOffset,
        ],
      ];
    }
    return beatmapSet;
  }

  constructor(props) {
    super(props);
    this.path = join(remote.app.getPath('documents'), '/Beatconnect/history.json');
    this.state = {
      history: {},
      stats: {
        overallUnplayedCount: 0,
        overallDuration: 0,
      },
      save: this.save,
      contains: this.contains,
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

        this.setState({ history });
      })
      .catch(e => {
        error(e);
        this._createHistory(); // assume file does not exist
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

  render() {
    const { children } = this.props;
    return <HistoryContext.Provider value={this.state}>{children}</HistoryContext.Provider>;
  }
}

export default HistoryProvider;
