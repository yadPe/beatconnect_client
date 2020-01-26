const { app } = require('electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');
const log = require('electron-log');
const isDev = require('electron-is-dev');

const makeTracker = () => {
  const visitor = ua('UA-xxxxx-2', machineIdSync(true), {
    // TODO Parse user agent so we can track user os type
    an: app.getName(),
    av: app.getVersion(),
    ul: app.getLocale(),
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
    console.log('traked', category, action);
  };

  const trackNavigation = sectionName => {
    visitor.pageview({ dp: `/${sectionName}`, dt: sectionName }, errorHandler).send();
    console.log('trackNav', sectionName);
  };

  trackEvent('app', 'launch');
  // visitor
  //   .event({ ec: 'app', ea: 'launch' })
  //   .event({ ea: 'name', ev: app.getName() })
  //   .event({ ea: 'version', ev: app.getVersion() })
  //   .event({ ea: 'language', ev: app.getLocale() })
  //   .send();
  return { visitor, trackEvent, trackNavigation };
};

module.exports = { makeTracker };
