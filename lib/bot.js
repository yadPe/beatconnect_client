const { BeatconnectApi, getDlLink } = require('./beatconnectApi');
const MpMatch = require('./mpMatch');
const conf = require('../conf');

class Bot {
  constructor() {
    this.targetServer = require('../conf').targetServer;
    this.beatconnect = new BeatconnectApi();
    this.prefix = conf.prefix;
    this.matchs = [];
    this.onMessage = this.onMessage.bind(this);
    this.newMatch = this.newMatch.bind(this);
    this.newBeatmap = this.newBeatmap.bind(this);
    this.sendMapById = this.sendMapById.bind(this);
    if (this.targetServer === 'osuMain') {
      this.OsuIrc = require('./osuIrc');
      this.OsuApi = require('./osuApi');
      this.irc = new this.OsuIrc(this.onMessage, this.newBeatmap);
      this.osuApi = new this.OsuApi();
    };
    this.state = {};
  }

  sendMapById(beatmapSetId, to) {
    this.beatconnect.getBeatmapById(beatmapSetId)
    .then(response => getDlLink(response, true))
    .then(link => this.irc.pm(to, link))
    .catch(err => {
      console.error(err);
      this.irc.pm(to, 'oops ! Cannot get beatmap')
    });
  }

  newMatch(id, matchName, ircRoom, creator) {
    console.log(`New match created : ${id} ${matchName} ${ircRoom}`);
    this.matchs.push(new MpMatch(id, matchName, ircRoom, creator, this.irc, this.sendMapById ));
  }

  newBeatmap(beatmapId, matchId){
    this.osuApi.getSetId(beatmapId)
    .then(setId => this.matchs.map(match => match.id === matchId ? match.updateBeatmap(setId): null))
    .catch(err => console.log(err));
    
  }

  onMessage(from, channel, text, rawMsg) {
    console.log(rawMsg);
    if (!text.startsWith(this.prefix)) return;
    const params = text.split(' ');
    const command = params.shift().split(this.prefix).pop();
    switch (command) {
      case 'get':
        if (!parseInt(params[0])) { this.irc.pm(from, 'You need to specify a beatmap id'); break; }
        this.sendMapById(params[0], from)
        break;
      case 'infos':
        this.irc.pm(from, conf.commands.map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`).join('\n'));
        break;
      case 'createRoom':
        this.irc.makeMatch(params[0], this.newMatch, from).then(response => this.irc.pm(`Your match "-sus-" is ready !`)).catch(err => console.error(err));
        break;
      case 'search':
        this.beatconnect.searchBeatmap(params).then(result => this.irc.pm(from, result)).catch(err=> console.error(err));
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
// ok.getMapById(873811);

module.exports = Bot;