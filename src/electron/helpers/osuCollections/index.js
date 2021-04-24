const { readCollectionDB, writeCollectionDB } = require('./collections.utils');

readCollectionDB('H:/GAMES/osssu/collection.db').then(collections => {
  console.log('READ : ', collections);
  collections['test Beatconnect'] = ['82b6eee44e0fc0e3b2e38cddcc0e1666'];
  // writeCollectionDB('H:/GAMES/osssu/collection.db', collections).then(() => {
  //   readCollectionDB('H:/GAMES/osssu/collection.db').then(console.log);
  // });
});
