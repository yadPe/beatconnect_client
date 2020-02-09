import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { crashed: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below, send a crash report and re-render with error message
    if (process.env.NODE_ENV !== 'development') {
      console.log('Sending error report via ga', { error, errorInfo });
      ipcRenderer.send('renderer-crash', error.message);
      // visitor.exception(JSON.stringify({ error, errorInfo }, undefined, 2)).send();
    }
    this.setState({ crashed: true, error, errorInfo });
  }

  render() {
    if (this.state.crashed) {
      // Error path
      return (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h2>Oops Beatconnect crashed, an error report will be automatically sent to the developers</h2>
          {this.state.error && (
            <>
              <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            </>
          )}
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
