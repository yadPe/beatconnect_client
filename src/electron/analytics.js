const { app, dialog, ipcMain } = require('electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const log = require('electron-log');
const isDev = require('electron-is-dev');

const makeTracker = userAgent => {
  const visitor = ua(process.env.BEATCONNECT_CLIENT_GA_TRACKING_ID, machineIdSync(true), {
    strictCidFormat: false,
    tid: process.env.BEATCONNECT_CLIENT_GA_TRACKING_ID,
  });

  visitor.set('ua', userAgent);
  visitor.set('an', app.name);
  visitor.set('av', app.getVersion());
  visitor.set('ul', app.getLocale());
  visitor.set('ds', 'app');

  const errorHandler = err => {
    if (err) log.error(`Analytics error: ${err.message}`);
  };

  const trackEvent = (category, action, label, value) => {
    if (!isDev) {
      visitor
        .event(
          {
            ec: category,
            ea: action,
            el: label,
            ev: value,
          },
          errorHandler,
        )
        .send();
    }
  };

  const trackNavigation = sectionName => {
    if (!isDev) {
      visitor.pageview({ dp: `/${sectionName}`, dt: sectionName }, errorHandler).send();
    }
  };

  ipcMain.on('renderer-crash', (_event, error) => {
    if (!isDev) visitor.exception(error).send();
    const messageBoxOptions = {
      type: 'error',
      title: "WHO'S AFRAID OF THE BIG BLACK",
      message: `Beatconnect failed: ${error} \n to retry please restart the app`,
    };
    dialog.showMessageBox(messageBoxOptions);
  });

  process.on('uncaughtException', err => {
    if (!isDev) visitor.exception(err.toString()).send();
    const messageBoxOptions = {
      type: 'error',
      title: '404 cookiezi not found',
      message: `Oops something failed inside Beatconnect: "${err.message}" \n If you notice some unusual behaviors please report it on discord and restart the app`,
    };
    console.error(err);
    log.error(err);
    dialog.showMessageBox(messageBoxOptions);
  });

  trackEvent('app', 'launch');
  return { visitor, trackEvent, trackNavigation };
};

module.exports = { makeTracker };
