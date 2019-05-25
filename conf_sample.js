const config = {
  irc: { // Your IRC credentials
    Server: 'irc.ppy.sh',
    Port: '6667',
    username: 'user',
    password: 'pass',
  },

  osuApi: { // Your game API key
    key: 'apiKey'
  },

  beatconnectAPI: { // Your Beatconnect API Key
    key: 'apiKey'
  },

  prefix: '!',
  targetServer: 'osuMain' // osuMain, akaTsuki, gatari, ripple | Only main server is suported now

};

module.exports = { config };