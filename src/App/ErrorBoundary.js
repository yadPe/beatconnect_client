import React, { Component } from 'react';
import os from 'os';
import { remote } from 'electron';
import store from '../shared/store';

const { visitor } = remote.getGlobal('tracking');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: null };
  }

  componentDidUpdate() {
    console.log('strate', this.state);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { crashed: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below, send a crash report and re-render with error message
    const report = {
      error: error.toString(),
      errorInfo: { componentStack: errorInfo.componentStack.trim().split('\n') },
      clientVer: remote.app.getVersion(),
      date: new Date().toUTCString(),
      applicationState: store.getState(),
      systemInfos: {
        OsType: os.type(),
        Platform: os.platform(),
        Release: os.release(),
        Arch: os.arch(),
        Freemem: `${os.freemem() * 1e-6} mb`,
        Totalmem: `${os.totalmem() * 1e-6} mb`,
        Cpus: os.cpus(),
      },
    };
    // Don't send user's osu api key and irc password in the report
    delete report.applicationState.settings.userPreferences.irc.password;
    delete report.applicationState.settings.userPreferences.osuApi;
    console.log('report ready', report);

    if (process.env.NODE_ENV === 'development') return;
    console.log('Sending error report via ga');
    visitor.exception(JSON.stringify(report, undefined, 2)).send();
  }

  render() {
    if (this.state.crashed) {
      // Error path
      return (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h2>Oops Beatconnect crashed, an error report will be automatically sent to the developers</h2>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
