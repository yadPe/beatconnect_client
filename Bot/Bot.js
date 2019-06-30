const { BeatconnectApi, getDlLink } = require('./BeatconnectApi');
const MpMatch = require('./multiplayer/mpMatch');
const WebUi = require('./web/web')

class Bot {
  constructor(configFile) {
    this.regExp = [/.*?((?:\/[\w\.\-]+)+)/i, /.*?(?:\/[\w\.\-]+)+.*?(?:\/[\w\.\-]+)+.*?((?:\/[\w\.\-]+)+)/i];
    this.conf = configFile;
    this.targetServer = this.conf.targetServer;
    this.beatconnect = new BeatconnectApi(this.conf.beatconnectAPI.key);
    this.prefix = this.conf.prefix;
    this.matchs = [];
    this.commandsList = this.conf.commands.map(cmd => cmd.command.split(' ').shift().toLowerCase());
    this.ignoreList = ['mp', 'stats', 'help', 'roll', 'where', 'faq', 'report', 'request']
    this.onMessage = this.onMessage.bind(this);
    this.onMpMessage = this.onMpMessage.bind(this);
    this.newMatch = this.newMatch.bind(this);
    this.newBeatmap = this.newBeatmap.bind(this);
    this.sendMapById = this.sendMapById.bind(this);
    this.endMatch = this.endMatch.bind(this);
    this.np = this.np.bind(this);
    if (this.targetServer === 'osuMain') {
      this.OsuIrc = require('./OsuIrc');
      this.OsuApi = require('./OsuApi');
      this.irc = new this.OsuIrc(this.onMessage, this.onMpMessage, this.np, this.endMatch, this.conf);
      this.irc.onBeatmapChange = this.newBeatmap;
      this.osuApi = new this.OsuApi(this.conf.osuApi.key);
    };
    this.web = new WebUi(this.matchs, this.irc.makeMatch);
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

  newMatch(id, matchName, ircRoom, creator, playerList) {
    console.log(`New match created : ${id} ${matchName} ${ircRoom} ${creator}`);
    const alreadyExist = false;
    this.matchs.map(match => {
      if (match.id === id)
        alreadyExist = true
    })
    if (alreadyExist) return
    const newMatch = new MpMatch(id, matchName, ircRoom, creator, this.irc, this.sendMapById, this.endMatch, this.conf.autoBeat)
    if (playerList){
      newMatch.players = playerList
    }
    this.matchs.push(newMatch);
    this.web.matchs = this.matchs;
    console.log(this.matchs)
  }

  endMatch(matchId) {
    this.matchs = this.matchs.filter(match => match.id !== matchId);
    console.log(`Current matchs : ${this.matchs}`)
  }

  newBeatmap(beatmapId, matchId) {
    this.osuApi.getSetId(beatmapId)
      .then(res => this.matchs.map(match => match.id === matchId ? match.updateBeatmap(res) : null))
      .catch(err => console.error(err));
  }

  np(beatmapId, from) {
    this.osuApi.getSetId(beatmapId)
      .then(res => this.sendMapById(res.beatmapset_id, from))
      .catch(err => console.error(err))
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
          console.log(`Host for ${match.matchName} is now ${player}`)
        }
      }
    })
  }

  onMessage(from, channel, text, rawMsg) {
    if (!text.startsWith(this.prefix)) return;
    const params = text.split(' ');
    const command = params.shift().split(this.prefix).pop().toLowerCase();
    if (this.ignoreList.includes(command)) return;
    let fromMp = null;
    if (channel.startsWith('#mp')) fromMp = channel;

    switch (command) {
      case this.commandsList[2]: //get
        if (!parseInt(params[0])) { this.irc.pm(fromMp || from, `${fromMp ? from : ''} You need to specify a beatmap id`); break; }
        this.sendMapById(params[0], from)
        break;
      case this.commandsList[5]: //infos
        this.irc.pm(fromMp || from, this.conf.commands
          .map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`).join('\n'));
        break;
      case this.commandsList[0]: //createroom
        this.irc.makeMatch(params[0], from)
          .then(({ matchId, name, matchRoom, creator }) => this.newMatch(matchId, name, matchRoom, creator))
          .catch(err => {
            console.error(err);
            this.irc.pm(from, 'Unable to create the match, maybe you already have too many matchs currently open');
          });
        break;
      case this.commandsList[1]: //search
        this.beatconnect.searchBeatmap(params)
          .then(result => this.irc.pm(fromMp || from, result))
          .catch(err => console.error(err));
        break;
      case this.commandsList[4]: //beat
        if (!fromMp) { this.irc.pm(from, `You need to be in a multiplayer match previously created with the ${this.prefix}createRoom command to use this`); break; }
        const matchId = fromMp.split('_').pop();
        this.matchs.map(match => {
          if (match.if = matchId)
            this.sendMapById(match.beatmap, fromMp, match.fullBeatmapData);
        });
        break;
      case 'join':
        if (!parseInt(params[0])) {
          this.irc.pm(from, 'You need to provide a valid match id')
          break;
        }
        this.irc.joinMatch(params[0])
          .then(({matchId, playerList}) => this.newMatch(matchId, null, `#mp_${matchId}`, null, playerList))
          .catch(err => {console.error(err); this.irc.pm(from, 'Cannot find this room')})
        break;
      default:
        this.irc.pm(fromMp || from, `${fromMp ? from : ''} Unknown command try: ${this.prefix}infos`);
        break;
    }
  }
}

module.exports = Bot;