import React, { Component, createContext, useContext } from 'react';
import { ThemeProvider } from 'react-jss';
import ConfLoader from '../modules/Settings/helpers/ConfLoader';
import config from '../../shared/config';

export const AppThemeContext = createContext();

export const useSetTheme = () => useContext(AppThemeContext);

const isDark = hexColor => {
  const coefs = [0.299, 0.587, 0.114];
  return (
    hexColor
      .match(/[A-Za-z0-9]{2}/g)
      .map(value => parseInt(value, 16))
      .reduce((acc, value, index) => acc + value * coefs[index], 0) < 186
  );
};

const accentColor =
  (ConfLoader.conf.userPreferences.theme && ConfLoader.conf.userPreferences.theme.accentColor) ||
  config.display.defaultAccentColor;

class AppThemeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: {
        style: 'dark',
        dark: true,
        warning: '#ed2828',
        title: 'Beatconnect',
        accentContrast: isDark(accentColor) ? 'dark' : 'light',
        palette: {
          primary: {
            dark: '#000',
            main: '#1d1d1d',
            accent: accentColor,
          },
          secondary: {
            dark: '#121212',
          },
        },
      },
      setAccentColor: this.setAccentColor.bind(this),
      setTheme: this.setTheme.bind(this),
    };
  }

  setAccentColor = color => {
    const { theme: currentTheme } = this.state;
    currentTheme.palette.primary.accent = color;
    currentTheme.accentContrast = isDark(color) ? 'dark' : 'light';
    console.log(currentTheme);
    this.setState({ theme: { ...currentTheme } });
  };

  setTheme = newTheme => {
    const { theme: currentTheme } = this.state;
    this.setState({ theme: { ...currentTheme, ...newTheme } });
  };

  render() {
    const { theme, setTheme, setAccentColor } = this.state;
    const { children } = this.props;
    return (
      <AppThemeContext.Provider value={{ setTheme, setAccentColor }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AppThemeContext.Provider>
    );
  }
}

export default AppThemeProvider;
