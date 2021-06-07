import { createServer, Model, Factory } from 'miragejs';

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = 'https://beatconnect.io/api';

      this.get('search');
    },
  });
}
