const { lookup } = require('dns');

const canResolve = hostname =>
  new Promise(resolve => {
    lookup(hostname, err => {
      if (err && err.code === 'ENOTFOUND') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

const isOnline = async (callBack, sendToRenderer) => {
  const results = await Promise.all([canResolve('beatconnect.io'), canResolve('osu.ppy.sh')]);
  const online = results.every(result => result);
  if (sendToRenderer) sendToRenderer('online-status', { online });
  callBack(true);
};

module.exports = isOnline;
