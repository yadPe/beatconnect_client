/* Provides download history from {localUser}/Documents/Beatconnect/history.json */
import React, { Component } from 'react';
import { remote } from 'electron';
import { outputJSON, readJson } from 'fs-extra';

export const HistoryContext = React.createContext();

class HistoryProvider extends Component {
  constructor(props) {
    super(props);
    this.path = remote.app.getPath('documents') + '/Beatconnect/history.json'
    this.state = {
      history: {},
      save: this.save,
      contains: this.contains,
      clear: this.clear,
      set: this.set
    }
  }

  componentDidMount() {
    this._readHistory()
  }

  componentDidUpdate() {
    // const { history } = this.state
    //if (Object.keys(history).length !== 0) {
      this._writeHistory()
    //}
  }

  set = (data) => {
    let { history } = this.state;
    console.log(data)
    history = {...data}
    this.setState({ history })
  }

  save = (item) => {
    const { id, name } = item;
    let { history } = this.state;
    history[id] = { id, name, date: Date.now() }
    console.log('saved in history', history)
    this.setState({ history })
  }

  contains = (id) => {
    const { history } = this.state;
    return typeof history[id] !== 'undefined'
  }

  clear = () => {
    let { history } = this.state;
    history = {};
    this.setState({ history },
      () => {
        this._writeHistory();
      }
    )
  }

  _readHistory = () => {
    readJson(this.path)
      .then(history => this.setState({ history }))
      .catch(this._createHistory) // assume file does not exist
  }

  _createHistory = () => {
    const { history } = this.state
    outputJSON(this.path, history)
      .then(() => console.log('History Created!'))
      .catch(console.error)
  }

  _writeHistory = () => {
    const { history } = this.state
    outputJSON(this.path, {...history})
      .then(() => console.log('History saved!'))
      .catch(console.error)
  }

  render() {
    const { children } = this.props;
    return (
      <HistoryContext.Provider value={this.state}>{children}</HistoryContext.Provider>
    );
  }
}

export default HistoryProvider;