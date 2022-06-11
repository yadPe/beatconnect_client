const Realm = require('realm');
const { Task } = require('../shared/realm/schema.old');

async function initRealm() {
  const config = {
    schema: [Task],
    path: 'beatconnect.realm',
  };

  // open a synced realm
  const realm = await Realm.open(config);

  realm.write(() => {
    realm.deleteAll();
  });

  const tasks = realm.objects('Task');
  console.log(`Main: Number of Task objects: ${tasks.length}`);

  realm.write(() => {
    realm.create('Task', Task.generate('newDescription'));
  });
}

module.exports = { initRealm };
