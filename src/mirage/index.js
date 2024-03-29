import { createServer } from 'miragejs';

export function makeServer() {
  return createServer({
    routes() {
      this.timing = 0;

      this.get('https://beatconnect.io/api/search', async (schema, request) => {
        const { p: page } = request.queryParams;

        const mockName = `page${page}.json`;
        const { default: mock } = await import(`./mocks/search/${mockName}`);

        return mock;
      });

      this.get('https://beatconnect.io/api/packs/weekly', async () => {
        const { default: mock } = await import(`./mocks/packs/weekly.json`);

        return mock;
      });

      this.get('https://beatconnect.io/api/packs', async () => {
        const { default: mock } = await import(`./mocks/packs/packs.json`);

        return mock;
      });

      this.get('https://v2.beatconnect.io/api/collections', async () => {
        const { default: mock } = await import(`./mocks/collections/collections_listing.json`);

        return mock;
      });

      this.get('https://v2.beatconnect.io/api/collections/:id', async (schema, request) => {
        const { default: mock } = await import(`./mocks/collections/collections.json`);

        return mock[request.params.id];
      });

      this.passthrough('https://osu.ppy.sh/api/**');
      this.passthrough('https://beatconnect.io/api/beatmap/**');
    },
  });
}
