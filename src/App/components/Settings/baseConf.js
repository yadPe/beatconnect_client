module.exports = {
  userPreferences: {
    volume: 50,
    targetServer: 'osuMain',
    prefix: '!',
    autoBeat: true,
    autoImport: true,
    importMethod: 'auto',
    irc: {
      server: 'irc.ppy.sh',
      port: 6667,
      username: '',
      password: '',
      isBotAccount: false,
    },
    osuApi: {
      key: '',
    },
    theme: {
      style: 'dark',
      primary: '#121212',
      secondary: '#2a2a2a',
      warning: '#ed2828',
      color: '#00965f',
      title: 'Beatconnect',
    },
  },
  beatconnectAPI: {
    key: 'b3z8gl9pzt7iqa89',
  },
  _comment: 'Below you can change how a command is called in the chat and its description',
  commands: [
    {
      command: 'createRoom <name>',
      description: 'Create a multiplayer room with the specified name and send you an invite once the room is ready',
    },
    {
      command: 'search <texte>',
      description:
        'Perform a search as on beatconnect’s website and return the 4 first ranked occurrences and a link to the other results on Beatconnect.',
    },
    {
      command: 'get <beatmapSet Id>',
      description: 'Return the download link for the requested beatmapId',
    },
    {
      command: 'pp <beatmap Id>',
      description: 'Return the pp value for the requested beatmapId WIP',
    },
    {
      command: 'beat',
      description: 'Return the beatconnect download link of the current beatmap in a multiplayer match.',
    },
    {
      command: 'infos',
      description: 'Print available commands',
    },
    {
      command: 'join <match Id>',
      description:
        'Request the bot to connect to the specified match (Bot must be added as match referee before with `!mp addref`).',
    },
  ],
};
