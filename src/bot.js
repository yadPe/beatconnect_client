const { BeatconnectApi, getDlLink } = require('./beatconnectApi');
const MpMatch = require('./multiplayer/mpMatch');

class Bot {
  constructor(configFile) {
    this.regExp = [/.*?((?:\/[\w\.\-]+)+)/i, /.*?(?:\/[\w\.\-]+)+.*?(?:\/[\w\.\-]+)+.*?((?:\/[\w\.\-]+)+)/i];
    this.conf = configFile;
    this.targetServer = this.conf.targetServer;
    this.beatconnect = new BeatconnectApi(this.conf.beatconnectAPI.key);
    this.prefix = this.conf.prefix;
    this.matchs = [];
    this.ignoreList = ['mp', 'stats', 'help', 'roll', 'where', 'faq', 'report', 'request']
    this.onMessage = this.onMessage.bind(this);
    this.onMpMessage = this.onMpMessage.bind(this);
    this.newMatch = this.newMatch.bind(this);
    this.newBeatmap = this.newBeatmap.bind(this);
    this.sendMapById = this.sendMapById.bind(this);
    this.endMatch = this.endMatch.bind(this);
    if (this.targetServer === 'osuMain') {
      this.OsuIrc = require('./osuIrc');
      this.OsuApi = require('./osuApi');
      this.irc = new this.OsuIrc(this.onMessage, this.onMpMessage);
      this.irc.onBeatmapChange = this.newBeatmap;
      this.osuApi = new this.OsuApi(this.conf.osuApi.key);
    };
    this.state = {};
  }

  sendMapById(beatmapSetId, to, extra) {
    this.beatconnect.getBeatmapById(beatmapSetId)
      .then(response => getDlLink(response, true, extra))
      .then(link => this.irc.pm(to, link))
      .catch(err => {
        console.error(err);
        this.irc.pm(to, 'oops ! Cannot get beatmap')
      });
  }

  newMatch(id, matchName, ircRoom, creator) {
    console.log(`New match created : ${id} ${matchName} ${ircRoom} ${creator}`);
    this.matchs.push(new MpMatch(id, matchName, ircRoom, creator, this.irc, this.sendMapById, this.endMatch));
    console.log(this.matchs)
  }

  endMatch(matchId){
    this.matchs = this.matchs.filter(match => match.id !== matchId);
    console.log(this.matchs)
  }

  newBeatmap(beatmapId, matchId) {
    this.osuApi.getSetId(beatmapId)
      .then(res => this.matchs.map(match => match.id === matchId ? match.updateBeatmap(res) : null))
      .catch(err => console.log(err));
  }

  onMpMessage(matchId, msg) {
    this.matchs.map(match => {
      if (match.id === matchId) {
        const { rawMsg, from, channel, text } = msg;
        const { rawCommand, args } = rawMsg;
        if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('Beatmap changed to')) {
          const beatmapId = this.regExp[1].exec(args[1])[1].split('/').pop();
          this.newBeatmap(beatmapId, matchId);
        } else if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('joined in')) {
          const player = args[1].split(' ').shift();
          match.playerJoin(player);
        } else if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('left the game.')) {
          const player = args[1].split(' ').shift();
          match.playerLeave(player);
        } else if (rawCommand === 'PRIVMSG' && args[0].includes('mp') && args[1].includes('became the host.')) {
          const player = args[1].split(' ').shift();
          match.host = player;
        }
      }
    })
  }

  onMessage(from, channel, text, rawMsg) {
    if (!text.startsWith(this.prefix)) return;
    let fromMp = null;
    if (channel.startsWith('#mp')) fromMp = channel;
    const params = text.split(' ');
    const command = params.shift().split(this.prefix).pop().toLowerCase();
    switch (command) {
      case 'get':
        if (!parseInt(params[0])) { this.irc.pm(fromMp || from, `${fromMp ? from : ''} You need to specify a beatmap id`); break; }
        this.sendMapById(params[0], from)
        break;
      case 'infos':
        this.irc.pm(fromMp || from, this.conf.commands
          .map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`).join('\n'));
        break;
      case 'createroom':
        this.irc.makeMatch(params[0], from)
        .then(({matchId, name, matchRoom, creator}) => this.newMatch(matchId, name, matchRoom, creator))
        .catch(err => console.error(err));
        break;
      case 'search':
        this.beatconnect.searchBeatmap(params)
        .then(result => this.irc.pm(fromMp || from, result))
        .catch(err => console.error(err));
        break;
      case 'beat':
        if (!fromMp) {this.irc.pm(from, `You need to be in a multiplayer match previously created with the ${this.prefix}createRoom command to use this`); break;}
        const matchId = fromMp.split('_').pop();
        this.matchs.map(match => {
          if (match.if = matchId){
            this.sendMapById(match.beatmap, fromMp, match.fullBeatmapData);
            break;
          }
        });
        break;
      default:
        if (this.ignoreList.includes(params[0])) break;
        this.irc.pm(fromMp || from, `${fromMp ? from : ''} Unknown command try: ${this.prefix}infos`);
        break;
    }
  }
}

module.exports = Bot;