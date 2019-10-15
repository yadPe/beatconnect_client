import React, { Component } from 'react';
import store from './store';
import os from 'os';
import { remote } from 'electron';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { report: null, status: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below, send a crash report and re-render with error message
    if (this.crashed) return;
    this.crashed = true;
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
    this.setState(
      {
        report,
      },
      this.sendReport,
    );
  }

  sendReport() {
    if (process.env.NODE_ENV === 'development')
      return this.setState({ status: 'No crash report will be sent since the app is running in the dev environement' });
    const { report } = this.state;
    this.setState({ status: 'Sending crash report..' });
    fetch('https://oaw7vuooo1.execute-api.eu-west-1.amazonaws.com/production/BC-crash-report/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report }),
    }).then(res =>
      res.status === 200
        ? this.setState({ status: 'Report sent, you can restart the app' })
        : this.setState({ status: 'Failed to send report, you can restart the app' }),
    );
  }

  render() {
    if (this.state.report) {
      // Error path
      return (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h2>Oops Beatconnect crashed, an error report will be automatically sent to the developers</h2>
          <h4>{this.state.status}</h4>
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {this.state.report.error && this.state.report.error.toString()}
            <br />
            {this.state.report.errorInfo.componentStack.join('\n')}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
