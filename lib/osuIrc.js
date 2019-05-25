const irc = require('irc')
const conf = require('../conf');
require('string.prototype.startswith');

class OsuIrc {
  constructor(onMessage) {
    this.config = conf.irc;
    this.prefix = conf.prefix;
    this.commands = conf.commands.map(cmd => cmd.command.split(' ').shift());
    this.nickName = this.config.username;
    this.client = new irc.Client(this.config.server, this.config.username, {
      userName: this.nickName,
      realName: this.nickName,
      password: this.config.password,
      port: this.config.port,
      debug: true,
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
      retryCount: 0,
      retryDelay: 2000,
      stripColors: false,
      channelPrefixes: "#",
      messageSplit: 512,
      encoding: 'utf8'
    });
    //this.onMessage = this.onMessage.bind(this);
    this.client.on('error', console.error);
    this.client.addListener('message', onMessage)
  }

  join() {


    
  }

  // onMessage(from, channel, text, rawMsg){
  //   console.log(text, this.prefix)
  //   console.log(text.startsWith(this.prefix))
  //   if (!text.startsWith(this.prefix)) return;
  //   const command = text.split(this.prefix).pop();
  //   console.log(command)
  //   switch(command){
  //     case this.commands[0]:
  //       break;
  //     case this.commands[5] :
  //       this.pm(from, conf.commands.map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`).join('\n'));
  //       break;
  //     default:
  //       this.pm(from, `Unknown command try: ${this.prefix}infos`);
  //       break;
  //   }
  //   // if (text.startsWith(this.prefix)){
  //   //   this.pm(from, 'ok')
  //   // }
  // }

  pm(user, message) {
    this.client.say(user, message)
  }

  
}



//const aa = new OsuIrc();


module.exports = OsuIrc;