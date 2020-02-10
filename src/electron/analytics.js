const { app, dialog, ipcMain } = require('electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const log = require('electron-log');
const isDev = require('electron-is-dev');

const makeTracker = userAgent => {
  const visitor = ua(process.env.BEATCONNECT_CLIENT_GA_TRACKING_ID, machineIdSync(true), {
    strictCidFormat: false,
    ua: userAgent,
    an: app.getName(),
    av: app.getVersion(),
    ul: app.getLocale(),
    ds: 'app',
  });

  const errorHandler = err =>
    // eslint-disable-next-line no-console
    err && (isDev ? log.error(`Analytics error: ${JSON.stringify(err)}`) : console.log('Analytics error: ', err));

  const trackEvent = (category, action, label, value) => {
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
  };

  const trackNavigation = sectionName => {
    visitor.pageview({ dp: `/${sectionName}`, dt: sectionName }, errorHandler).send();
  };

  ipcMain.on('renderer-crash', (_event, error) => {
    visitor.exception(error).send();
    const messageBoxOptions = {
      type: 'error',
      title: "WHO'S AFRAID OF THE BIG BLACK",
      message: `Beatconnect failed: ${error} \n to retry please restarting the app`,
    };
    dialog.showMessageBox(messageBoxOptions);
  });

  process.on('uncaughtException', err => {
    visitor.exception(err.toString()).send();
    const messageBoxOptions = {
      type: 'error',
      title: '404 cookiezi not found',
      message: `Oops something failed inside Beatconnect: "${err.message}" \n If you notice some unusual behaviors please report it on discord and restart the app`,
    };
    dialog.showMessageBox(messageBoxOptions);
  });

  trackEvent('app', 'launch');
  return { visitor, trackEvent, trackNavigation };
};

module.exports = { makeTracker };
