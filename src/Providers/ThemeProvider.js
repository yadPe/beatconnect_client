import React, { Component } from 'react';
import { ThemeProvider } from 'theming';

export const AppThemeContext = React.createContext();

class AppThemeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: {
        style: 'dark',
        dark: true,
        primary: '#000',
        secondary: '#2a2a2a',
        warning: '#ed2828',
        color: '#00965f',
        title: 'Beatconnect',
        colors: {},
      },
      setTheme: this.setTheme.bind(this),
    };
  }

  setTheme(newTheme) {
    const { theme: currentTheme } = this.state;
    this.setState({ theme: { ...currentTheme, ...newTheme } });
  }

  render() {
    const { theme, setTheme } = this.state;
    const { children } = this.props;
    return (
      <AppThemeContext.Provider value={setTheme}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AppThemeContext.Provider>
    );
  }
}

export default AppThemeProvider;
