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
        warning: '#ed2828',
        title: 'Beatconnect',
        palette: {
          primary: {
            dark: '#000',
            main: '#1d1d1d',
            accent: '#00965f',
          },
          secondary: {
            dark: '#121212',
          },
        },
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
