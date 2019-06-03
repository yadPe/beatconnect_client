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
      if (msg.command !== 'QUIT') {
        console.log(msg)
        msg.nick === "BanchoBot" ? this.banchoMsg(msg) : null
        this.previousRaw = msg;
      }
    })
  }

  banchoMsg(rawMsg, from, channel, text) {
    const { rawCommand, args } = rawMsg;
    if (rawCommand === 'MODE' && args[1] === '+v' && args[0].includes('mp'))
      this.eventEmitter.emit('newMatchCreated', rawMsg);
    else if (rawCommand === 'PRIVMSG' && args[0].includes('mp')) {
      const matchId = args[0].split('_').pop();
      this.onMpMessage(matchId, { rawMsg, from, channel, text })
    }
  }

  pm(user, message) {
    this.client.say(user, message)
  }

  makeMatch(name, creator) {
    return new Promise((resolve, reject) => {
      this.client.say('banchobot', `!mp make ${name}`);
      const timeout = setTimeout(() => { this.eventEmitter.removeAllListeners(); reject('Timed out'); }, 5000);
      this.eventEmitter.on('newMatchCreated', msg => {
        const { args } = msg;
        clearTimeout(timeout);
        this.eventEmitter.removeAllListeners();
        const matchRoom = args[0];
        const matchId = args[0].split('_').pop();
        resolve({matchId, name, matchRoom, creator});
      });
    });
  }
}


module.exports = OsuIrc;

