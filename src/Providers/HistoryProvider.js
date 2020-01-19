/* eslint-disable no-underscore-dangle */
/* Provides download history from {localUser}/Documents/Beatconnect/history.json */
import React, { Component, useContext, createContext } from 'react';
import { remote } from 'electron';
import { outputJSON, readJson } from 'fs-extra';
import { join } from 'path';

export const HistoryContext = createContext();
export const useDownloadHistory = () => useContext(HistoryContext);

class HistoryProvider extends Component {
  constructor(props) {
    super(props);
    this.path = join(remote.app.getPath('documents'), '/Beatconnect/history.json');
    this.state = {
      history: {},
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

  set = data => {
    let { history } = this.state;
    history = { ...data };
    this.setState({ history });
  };

  save = item => {
    const { id, name } = item;
    const { history } = this.state;
    history[id] = { id, name, date: Date.now() };
    console.log('saved in history', history);
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
      .then(history => this.setState({ history }))
      .catch(this._createHistory); // assume file does not exist
  };

  _createHistory = () => {
    const { history } = this.state;
    outputJSON(this.path, history)
      .then(() => console.log('History Created!'))
      .catch(console.error);
  };

  _writeHistory = () => {
    const { history } = this.state;
    outputJSON(this.path, { ...history })
      .then(() => console.log('History saved!'))
      .catch(console.error);
  };

  render() {
    const { children } = this.props;
    return <HistoryContext.Provider value={this.state}>{children}</HistoryContext.Provider>;
  }
}

export default HistoryProvider;
