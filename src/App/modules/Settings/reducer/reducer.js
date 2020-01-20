import ConfLoader from '../helpers/ConfLoader';

export default (settings = ConfLoader.conf, { type, payload }) => {
  let { userPreferences } = settings;
  switch (type) {
    case 'VOLUME':
      userPreferences = { ...userPreferences, volume: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'IRC_USER':
      userPreferences = { ...userPreferences, irc: { ...userPreferences.irc, username: payload } };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'IRC_PASS':
      userPreferences = { ...userPreferences, irc: { ...userPreferences.irc, password: payload } };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'IRC_IS_BOT':
      userPreferences = { ...userPreferences, irc: { ...userPreferences.irc, isBotAccount: payload } };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'OSU_API_KEY':
      userPreferences = { ...userPreferences, osuApi: { key: payload } };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'PREFIX':
      userPreferences = { ...userPreferences, prefix: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'AUTOBEAT':
      userPreferences = { ...userPreferences, autoBeat: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'AUTOIMPORT':
      userPreferences = { ...userPreferences, autoImport: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'SETIMPORTMETHOD':
      userPreferences = { ...userPreferences, importMethod: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'SIDEPANELEXPENDED':
      userPreferences = { ...userPreferences, sidePanelExpended: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'SONGSPATH':
      userPreferences = { ...userPreferences, osuSongsPath: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'OSUPATH':
      userPreferences = { ...userPreferences, osuPath: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'LASTSCAN':
      userPreferences = { ...userPreferences, lastScan: payload };
      return { ...settings, userPreferences: { ...userPreferences } };
    case 'SET_THEME_ACCENT_COLOR':
      userPreferences = { ...userPreferences, theme: { accentColor: payload } };
      return { ...settings, userPreferences: { ...userPreferences } };
    default:
      return settings;
  }
};
