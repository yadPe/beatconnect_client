const irc = require('irc')
const conf = require('../conf');
const events = require('events');
require('string.prototype.startswith');

class OsuIrc {
  constructor(onMessage, newBeatmap) {
    this.newBeatmap = newBeatmap;
    this.config = conf.irc;
    this.prefix = conf.prefix;
    this.eventEmitter = new events.EventEmitter();
    this.regExp = /.*?((?:\/[\w\.\-]+)+)/i;
    this.commands = conf.commands.map(cmd => cmd.command.split(' ').shift());
    this.nickName = this.config.username;
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
      floodProtectionDelay: 3000,
      sasl: false,
      retryCount: 2,
      retryDelay: 2000,
      stripColors: false,
      channelPrefixes: "#",
      messageSplit: 512,
      encoding: 'utf8'
    });
    this.client.on('error', console.error);
    //this.client.on('MODE', console.log('MOOOOOOOOOOOOOOOOODDDDEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'))
    this.client.addListener('message', (from, channel, text, rawMsg) => { rawMsg.nick === "BanchoBot" ? this.banchoMsg(rawMsg, from, channel, text) : onMessage(from, channel, text, rawMsg)});
    this.client.addListener('raw', msg => msg.command !== 'QUIT' ? msg.nick === "BanchoBot" ? this.banchoMsg(msg) : console.log(msg) : null)
  }

  banchoMsg(rawMsg, from, channel, text) {
    const { rawCommand, args } = rawMsg;
    if (rawCommand === 'MODE' && args[1] === '+v' && args[0].includes('mp')) 
      this.eventEmitter.emit('banchoMsg', rawMsg);
    else if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('Beatmap changed to')){
      const beatmapId = this.regExp.exec(args[1])[1].split('/').pop();
      const matchId = args[0].split('_').pop();
      this.onBeatmapChange(beatmapId, matchId);
    } else if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('joined in')){
      const player = args[1].split(' ').shift();
      const matchId = args[0].split('_').pop();
      this.onPlayerJoin(player, matchId);
    }

    console.log(rawMsg)
    console.log('banchoooooooooooooooooooooooooooooo\noooooooooooooooooooooooooo')
  }

  onBeatmapChange(beatmapId, matchId){

  }

  onPlayerJoin(player, matchId){
  }

  join() {

  }

  pm(user, message) {
    this.client.say(user, message)
  }

  makeMatch(name, callback, creator) {
    return new Promise((resolve, reject) => {
      this.client.say('banchobot', `!mp make ${name}`);
      const timeout = setTimeout(() => { this.eventEmitter.removeAllListeners(); reject('Timed out'); }, 5000);
      this.eventEmitter.on('banchoMsg', msg => {
        console.log(`MESSSSAAAAAAGGGGGEEEEEEEEEEEEE\n${JSON.stringify(msg)}`)
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