import store from '../../../../shared/store';

const resetBot = () => {
  const { bot } = store.getState();
  if (bot.instance.connect) {
    bot.instance.disconnect();
    store.dispatch({ type: 'DESTROY_BOT_INSTANCE' });
  }
};

export const saveVolume = payload => store.dispatch({ type: 'VOLUME', payload });

export const setIrcUser = payload => {
  resetBot();
  store.dispatch({ type: 'IRC_USER', payload });
};

export const setIrcPass = payload => {
  resetBot();
  store.dispatch({ type: 'IRC_PASS', payload });
};

export const setIRCIsBot = payload => {
  resetBot();
  store.dispatch({ type: 'IRC_IS_BOT', payload });
};

export const setOSUApiKey = payload => {
  resetBot();
  store.dispatch({ type: 'OSU_API_KEY', payload });
};

export const setPrefix = payload => store.dispatch({ type: 'PREFIX', payload });

export const setAutoBeat = payload => store.dispatch({ type: 'AUTOBEAT', payload });

export const setAutoImport = payload => store.dispatch({ type: 'AUTOIMPORT', payload });

export const setOsuSongsPath = payload => store.dispatch({ type: 'SONGSPATH', payload });

export const setOsuPath = payload => store.dispatch({ type: 'OSUPATH', payload });

export const setLastScan = payload => store.dispatch({ type: 'LASTSCAN', payload });

export const setImportMethod = payload => store.dispatch({ type: 'SETIMPORTMETHOD', payload });

export const saveThemeAccentColor = payload => store.dispatch({ type: 'SET_THEME_ACCENT_COLOR', payload });
