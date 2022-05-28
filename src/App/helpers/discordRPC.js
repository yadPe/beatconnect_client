import DiscordRPC from 'discord-rpc';
import { error } from 'electron-log';

try {
  DiscordRPC.register(process.env.BEATCONNECT_DISCORD_APP_ID);
} catch (e) {
  error('[DiscordRPC]: ', e);
}
let rpc = null;
let isReady = false;

const login = async () => {
  try {
    await rpc.login({ clientId: process.env.BEATCONNECT_CLIENT_DISCORD_APP_ID });
  } catch (err) {
    error('[Discord RPC Login]:', err);
  }
};

const startRPC = async () => {
  rpc = new DiscordRPC.Client({ transport: 'ipc' });
  rpc.on('ready', () => {
    isReady = true;
  });

  await login();
};

export const clearActivity = async () => {
  try {
    await rpc.clearActivity();
  } catch (err) {
    error('[Discord RPC clearActivity]:', err);
  }
};

const stopRPC = async () => {
  try {
    isReady = false;
    await clearActivity();
    await rpc.destroy();
    rpc = null;
  } catch (e) {
    error('[stopRPC]: ', e);
  }
};

const restartRPC = async () => {
  try {
    await stopRPC();
    await startRPC();
  } catch (e) {
    error('[restartRPC]: ', e);
  }
};

export const setPlayingSongPresence = async (title, artist, beatmapsetId) => {
  if (!isReady) {
    console.log('skipped discord rpc update', { rpc, isReady });
    return;
  }
  try {
    const displayTitle = `${artist} - ${title}`;
    await rpc.setActivity({
      state: displayTitle,
      details: 'Listening to',
      largeImageKey: 'play',
      largeImageText: displayTitle,
      smallImageKey: 'bc_icon',
      buttons: [{ label: 'Show in Beatconnect client', url: `beatconnect://preview/?setId=${beatmapsetId}` }],
      smallImageText: 'Beatconnect client',
      instance: false,
    });
  } catch (e) {
    error('[Set disord activity]', e);
    await restartRPC();
  }
};

try {
  startRPC();
} catch (e) {
  error('[Discord RPC]:', e);
}
