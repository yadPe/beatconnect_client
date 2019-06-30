const irc = require('../../node-irc/lib/irc')
const EventEmitter = require("events").EventEmitter;
require('string.prototype.startswith');

class OsuIrc {
  constructor(onMessage, onMpMessage, np, endMatch, config) {
    this.onMpMessage = onMpMessage;
    this.np = np;
    this.endMatch = endMatch
    this.config = config.irc;
    this.regExps = [/.*?(\d+)/i];
    this.prefix = config.prefix;
    this.eventEmitter = new EventEmitter();
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
      autoRejoin: true,
      autoConnect: true,
      channels: [],
      secure: false,
      selfSigned: false,
      certExpired: false,
      floodProtection: !this.config.isBotAccount,
      floodProtectionDelay: 2500,
      sasl: false,
      retryCount: 2,
      retryDelay: 2000,
      stripColors: false,
      channelPrefixes: "#",
      messageSplit: 512,
      encoding: 'utf8'
    });
    this.onError = err => {
      this.eventEmitter.emit('ircError', err)
      console.error(err)
    }
    this.client.on('error', this.onError);
    this.client.addListener('message', (from, channel, text, rawMsg) => {
      console.log(rawMsg)
      onMessage(from, channel, text, rawMsg);
      this.previousMessage = rawMsg;
    });
    this.client.addListener('raw', msg => {
      if (msg.command !== 'QUIT') {
        console.log(msg)
        if (msg.nick === "BanchoBot") {
          this.banchoMsg(msg)
        }
       // msg.nick === "BanchoBot" ?  : null
        const args = msg.args
        if(msg.command === 'rpl_namreply' && args[3]){
          const playerList = args[3].split(' ').filter(player => !((player.startsWith('@')) || (player.startsWith('+')) || (player === '')));
          const matchId = args[2].split('_').pop();
          console.log(playerList, matchId, 'ICI')
          this.eventEmitter.emit('namreply', { matchId, playerList})
        }
        if(msg.command === 'PART'){
          if (args[0].includes('mp')){
            const matchId = args[0].split('_').pop();
            this.endMatch(matchId);
          }
        }
        if (msg.args[1]) {
          console.log(msg.args[1])
          if (msg.args[1].includes('ACTION is listening to')) {
            const beatmapId = /.*?(\d+)/i.exec(msg.args[1])[1]
            console.log(beatmapId)
            this.np(beatmapId, msg.args[0].includes('mp') ? msg.args[0] : msg.nick)
          }
        }
        this.previousRaw = msg;
      }
    })
  }

  banchoMsg(rawMsg, from, channel, text) {
    const { rawCommand, args } = rawMsg;
    if (rawCommand === 'MODE' && args[1] === '+v' && args[0].includes('mp'))
      this.eventEmitter.emit('newMatchCreated', rawMsg);
    if (rawCommand === 'PRIVMSG' && args[1].includes('Created the tournament match')) {
      const matchId = this.regExps[0].exec(args[1])[1];
      const matchName = args[1].split(' ').pop();
      const matchRoom = `#mp_${matchId}`;
      //this.eventEmitter.emit('newMatchCreated', { matchId, matchName, matchRoom });
    }
    else if (rawCommand === 'PRIVMSG' && args[0].includes('mp')) {
      const matchId = args[0].split('_').pop();
      this.onMpMessage(matchId, { rawMsg, from, channel, text })
    }
  }

  pm(user, message) {
    this.client.say(user, message)
  }

  joinMatch(match_Id) {
    return new Promise((resolve, reject) => {
      const onError = err => {
        console.log(err.command)
        if (err.command === 'err_nosuchchannel') {
          reject('No such channel')
        }
      }
      const onNamreply = ({matchId, playerList}) => {
        if (match_Id === matchId){
          this.eventEmitter.removeListener('ircError', onError)
          this.eventEmitter.removeListener('namreply', onNamreply)
          resolve({matchId, playerList})
        }
      }
      this.eventEmitter.on('ircError', onError)
      this.eventEmitter.on('namreply', onNamreply)
      this.client.join(`#mp_${match_Id}`)
    })
  }

  // Don't work when called again before previous call is resolved - Need Fix //
  makeMatch(name, creator) {
    return new Promise((resolve, reject) => {
      const onNewMatch = msg => {
        const { args } = msg;
        clearTimeout(timeout);
        this.eventEmitter.removeAllListeners();
        const matchRoom = args[0];
        const matchId = args[0].split('_').pop();
        resolve({ matchId, name, matchRoom, creator });
      }
      const timeout = setTimeout(() => { this.eventEmitter.removeListener("newMatchCreated", onNewMatch);; reject('Timed out'); }, 5000);
      this.client.say('banchobot', `!mp make ${name}`);
      this.eventEmitter.on('newMatchCreated', onNewMatch);
    });
  }
}


export default OsuIrc;

