const irc = require('../node-irc/lib/irc')
const conf = require('../conf');
const EventEmitter = require("events").EventEmitter;
require('string.prototype.startswith');

class OsuIrc {
  constructor(onMessage, onMpMessage) {
    this.onMpMessage = onMpMessage;
    this.config = conf.irc;
    this.prefix = conf.prefix;
    this.eventEmitter = new EventEmitter();
    this.commands = conf.commands.map(cmd => cmd.command.split(' ').shift());
    this.nickName = this.config.username;
    this.previousMessage = null;
    this.previousRaw = null;
    this.client = new irc.Client(this.config.server, this.config.username, {
      userName: this.nickName,
      realName: this.nickName,
      password: this.config.password,
      port: this.config.port,
      debug: false,
      showErrors: true,
      autoRejoin: false,
      autoConnect: true,
      channels: [],
      secure: false,
      selfSigned: false,
      certExpired: false,
      floodProtection: !conf.irc.isBotAccount,
      floodProtectionDelay: 2500,
      sasl: false,
      retryCount: 2,
      retryDelay: 2000,
      stripColors: false,
      channelPrefixes: "#",
      messageSplit: 512,
      encoding: 'utf8'
    });
    this.client.on('error', console.error);
    this.client.addListener('message', (from, channel, text, rawMsg) => { 
      console.log(rawMsg)
      onMessage(from, channel, text, rawMsg);
      this.previousMessage = rawMsg;
    });
    this.client.addListener('raw', msg => {
      if (msg.command !== 'QUIT'){
        console.log(msg)
        msg.nick === "BanchoBot" ? this.banchoMsg(msg) : null
        this.previousRaw = msg;
      }
    })
  }

  banchoMsg(rawMsg, from, channel, text) {
    const { rawCommand, args } = rawMsg;
    if (rawCommand === 'MODE' && args[1] === '+v' && args[0].includes('mp'))
      this.eventEmitter.emit('banchoMsg', rawMsg);
     else if (rawCommand === 'PRIVMSG' && args[0].includes('mp')){
      const matchId = args[0].split('_').pop();
      this.onMpMessage(matchId, {rawMsg, from, channel, text})
    }
    //console.log(rawMsg)
    console.log('banchoooooooooooooooooooooooooooooo\noooooooooooooooooooooooooo')
  }

  pm(user, message) {
    this.client.say(user, message)
  }

  /**
	 * Creates a new multiplayer match an return the match id when ready
	 * @param {string} name match name
	 * @param {*} callback callback to be executed when a match is ready
   * @param {string} creator player who requested the match creation
   * @returns {Promise<null>} Resolves when match is ready
	 */
  makeMatch(name, callback, creator) {
    return new Promise((resolve, reject) => {
      this.client.say('banchobot', `!mp make ${name}`);
      const timeout = setTimeout(() => { this.eventEmitter.removeAllListeners(); reject('Timed out'); }, 5000);
      this.eventEmitter.on('banchoMsg', msg => {
        const { args } = msg;
        clearTimeout(timeout);
        this.eventEmitter.removeAllListeners();
        const matchRoom = args[0];
        const matchId = args[0].split('_').pop();
        callback(matchId, name, matchRoom, creator);
        resolve(matchId);
      });
    });
  }
}


module.exports = OsuIrc;

