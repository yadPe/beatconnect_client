import { createRealmContext } from '@realm/react';
import { Task } from '../../shared/realm/schema';

const config = {
  path: 'beatconnect.realm',
  schema: [Task],
  /*
     enable sync history, using "sync:true" (this allows changes to "my.realm" file
     to be synced by the realm opened in the main process)
  */
  // sync: true,
};

const { RealmProvider, useRealm, useQuery } = createRealmContext(config);

// export { useRealm, useQuery };

// export default RealmProvider;
