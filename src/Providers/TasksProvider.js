import React, { Component } from 'react';
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
  }
  componentDidUpdate(prevProps, prevState) {
    const { tasks } = this.state
    if (!this.context.currentDownload.item) {
      if (tasks['Downloading']) tasks['Downloading'].terminate() 
    }
  }
  componentWillUpdate() {
    const { tasks } = this.state
    if (this.context.currentDownload.item) {
      if (!tasks['Downloading']) return this.add({name: 'Downloading', status: 'running', description: `initializing`})
      if (tasks['Downloading'].description !== `${this.context.overallProgress * 100}% - ${this.context.queue.length} items in queue`) {
        tasks['Downloading'].description = `${this.context.overallProgress * 100}% - ${this.context.queue.length} items in queue`
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