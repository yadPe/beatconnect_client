const { app } = require('electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const log = require('electron-log');
const isDev = require('electron-is-dev');

const makeTracker = userAgent => {
  const visitor = ua(process.env.BEATCONNECT_CLIENT_GA_TRACKING_ID, machineIdSync(true), {
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

  trackEvent('app', 'launch');
  return { visitor, trackEvent, trackNavigation };
};

module.exports = { makeTracker };
