import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { DownloadQueueContext } from './DownloadQueueProvider';

export const TasksContext = React.createContext();

class TasksProvider extends Component {
  static contextType = DownloadQueueContext;
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
      lastTask: {},
      add: this.add
    }
    ipcRenderer.on('autoUpdater', (e, { status, releaseName }) => {
      switch(status){
        case 'checkingUpdate':
          this.add({ name: 'Checking for update', status: 'running', section: 'Settings' })
          break
        case 'noUpdateAvailable':
          if (this.state.tasks['Checking for update']) this.state.tasks['Checking for update'].terminate()
          break
        case 'updateAvailable':
          if (this.state.tasks['Checking for update']) this.state.tasks['Checking for update'].terminate()
          this.add({ name: 'Downloading update', status: 'running', section: 'Settings' })
          break
        case 'updateDownloaded':
          if (this.state.tasks['Downloading update']) this.state.tasks['Downloading update'].terminate()
          this.add({ name: `Version ${releaseName} ready`, status: 'running', section: 'Settings', description: 'You can now restart the app' })
          break
        default:
          break
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    const { tasks } = this.state
    const { queue } = this.context;
    if (!this.context.currentDownload.item && queue.length === 0) {
      if (tasks['Downloading']) tasks['Downloading'].terminate() 
    }
  } 
  componentWillUpdate() {
    const { tasks } = this.state
    const { overallProgress, queue } = this.context;
    if (this.context.currentDownload.item) {
      if (!tasks['Downloading']) return this.add({name: 'Downloading', status: 'running', description: `initializing`, section: 'Downloads'})
      const description = `${Math.round(overallProgress * 100)}% - ${queue.length} items in queue`
      if (tasks['Downloading'].description !== description) {
        tasks['Downloading'].description = description
        this.setState({tasks})
      }
    }
  }

  add = (task) => {
    task.terminate = (newDescription) => {
      const { tasks } = this.state
      delete tasks[task.name]
      task.status = 'terminated'
      if (newDescription) task.description = newDescription
      this.setState({lastTask: task, tasks})
    }
    const { tasks } = this.state
    tasks[task.name] = task
    this.setState({tasks})
    return task
  }



  render() {
    const { children } = this.props;
    return (
      <TasksContext.Provider value={this.state}>{children}</TasksContext.Provider>
    );
  }
}

export default TasksProvider;