const { app } = require('electron');
const ua = require('universal-analytics');
const { machineIdSync } = require('node-machine-id');

const makeTracker = () => {
  const visitor = ua('UA-XXXXXX-2', machineIdSync(), {
    an: app.getName(),
    av: app.getVersion(),
    ul: app.getLocale(),
  });

  const errorHandler = err => err && console.log('Analytics error: ', err);

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
  trackEvent('app', 'lauch');

  return { visitor, trackEvent };
};

module.exports = { makeTracker };
