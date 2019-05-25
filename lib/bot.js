const {BeatconnectApi, getDlLink} = require('./beatconnectApi');
const conf = require('../conf');

class Bot {
  constructor(){
    this.targetServer = require('../conf').targetServer;
    this.beatconnect = new BeatconnectApi();
    this.prefix = '!'
    this.onMessage = this.onMessage.bind(this)
    if (this.targetServer === 'osuMain'){
      this.OsuIrc = require('./osuIrc');
      this.irc = new this.OsuIrc(this.onMessage);
    }
    this.state = {};
  }

  getMapById(beatmapId){
    return this.beatconnect.getBeatmapById(beatmapId)
    .then(response => getDlLink(response, true));
  }

  onMessage(from, channel, text, rawMsg){
    if (!text.startsWith(this.prefix)) return;
    const params = text.split(' ');
    const command = params.shift().split(this.prefix).pop();
    switch(command){
      case 'get':
        //if(!params)
        if (!parseInt(params[0])) {this.irc.pm(from, 'You need to specify a beatmap id'); break;}
          this.beatconnect.getBeatmapById(params[0])
          .then(response => getDlLink(response, true))
          .then(link => this.irc.pm(from, link))
          .catch(err => {
            console.error(err);
            this.irc.pm(from, 'oops ! Cannot get beatmap')
          });
        break;
      case 'infos' :
        this.irc.pm(from, conf.commands.map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`).join('\n'));
        break;
      default:
        this.irc.pm(from, `Unknown command try: ${this.prefix}infos`);
        break;
    }
    // if (text.startsWith(this.prefix)){
    //   this.pm(from, 'ok')
    // }
  }
}

const ok = new Bot();
ok.getMapById(873811);

module.exports = Bot;