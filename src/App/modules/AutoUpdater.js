import { ipcRenderer } from 'electron';
import { useEffect, useRef } from 'react';
import { useTasks } from '../Providers/TaskProvider.bs';

const taskExits = (tasksRef, name) => {
  const tasks = tasksRef.current;
  return Object.keys(tasks).some(taskKey => tasks[taskKey].name === name);
};

const AutoUpdater = () => {
  const { add, terminate, tasks, update } = useTasks();

  const tasksRef = useRef([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    ipcRenderer.on('autoUpdater', (e, { status, info }) => {
      switch (status) {
        case 'checkingUpdate':
          add({ name: 'Checking for update', status: 'running', section: 'Settings' });
          break;
        case 'noUpdateAvailable':
          if (taskExits(tasksRef, 'Checking for update')) terminate('Checking for update');
          break;
        case 'updateAvailable':
          if (taskExits(tasksRef, 'Checking for update')) terminate('Checking for update');
          add({ name: `New version available`, status: 'running', section: 'Settings' });
          break;
        case 'updateDownloadProgress':
          if (taskExits(tasksRef, 'New version available')) terminate('New version available');
          if (taskExits(tasksRef, 'Checking for update')) terminate('Checking for update');
          if (!taskExits(tasksRef, 'Downloading update')) {
            add({
              name: `Downloading update`,
              status: 'running',
              section: 'Settings',
              description: `${Math.ceil(info.percent)}%`,
            });
          } else {
            update({
              name: 'Downloading update',
              description: `${Math.ceil(info.percent)}%`,
            });
          }
          break;
        case 'updateDownloaded':
          if (taskExits(tasksRef, 'New version available')) {
            terminate('New version available');
          }
          if (taskExits(tasksRef, 'Downloading update')) {
            terminate('Downloading update');
          }
          add({
            name: `Version ${info.releaseName} ready`,
            status: 'running',
            section: 'Settings',
            description: 'You can now restart the app',
          });
          break;
        default:
          break;
      }
    });
  }, []);

  return null;
};

export default AutoUpdater;
