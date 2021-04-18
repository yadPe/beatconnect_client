import DiscordRPC from 'discord-rpc';
import { error } from 'electron-log';

DiscordRPC.register(process.env.BEATCONNECT_DISCORD_APP_ID);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
let isReady = false;

export const setPlayingSongPresence = (title, artist, beatmapsetId) => {
  if (!isReady) {
    console.log('skipped discord rpc update', { rpc, isReady });
    return;
  }
  try {
    const displayTitle = `${artist} - ${title}`;
    rpc.setActivity({
      state: displayTitle,
      details: 'Listening to',
      largeImageKey: 'play',
      largeImageText: displayTitle,
      smallImageKey: 'bc_icon',
      buttons: [{ label: 'Show in Beatconnect', url: `beatconnect://preview/?setId=${beatmapsetId}` }],
      smallImageText: 'Beatconnect client',
      instance: false,
    });
  } catch (e) {
    error('[Set disord activity]', e);
  }
};

export const clearActivity = () => {
  rpc.clearActivity();
};

rpc.on('ready', () => {
  isReady = true;
});

rpc.login({ clientId: process.env.BEATCONNECT_CLIENT_DISCORD_APP_ID }).catch(err => {
  error('[Discord RPC Login]:', err, process.env.BEATCONNECT_CLIENT_DISCORD_APP_ID);
});
