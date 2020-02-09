import OsuIrc from './OsuIrc';
import OsuApi from './OsuApi';
import MpMatch from './multiplayer/mpMatch';
import store from '../shared/store';
import { updateMatchsList } from './actions';

const { BeatconnectApi, getDlLink } = require('./BeatconnectApi');

class Bot {
  constructor(configFile) {
    this.regExps = [/.*?(?:\/[\w.-]+)+.*?(?:\/[\w.-]+)+.*?((?:\/[\w.-]+)+)/i];
    this.conf = configFile;
    this.targetServer = this.conf.userPreferences.targetServer;
    this.beatconnect = new BeatconnectApi(this.conf.beatconnectAPI.key);
    this.prefix = this.conf.userPreferences.prefix;
    this.matchs = [];
    this.commandsList = this.conf.commands.map(cmd =>
      cmd.command
        .split(' ')
        .shift()
        .toLowerCase(),
    );
    this.ignoreList = ['mp', 'stats', 'help', 'roll', 'where', 'faq', 'report', 'request'];
    this.onMessage = this.onMessage.bind(this);
    this.onMpMessage = this.onMpMessage.bind(this);
    this.newMatch = this.newMatch.bind(this);
    this.newBeatmap = this.newBeatmap.bind(this);
    this.sendMapById = this.sendMapById.bind(this);
    this.endMatch = this.endMatch.bind(this);
    this.np = this.np.bind(this);
    if (this.targetServer === 'osuMain') {
      this.irc = new OsuIrc(this.onMessage, this.onMpMessage, this.np, this.endMatch, this.conf);
      this.irc.onBeatmapChange = this.newBeatmap;
      this.osuApi = new OsuApi(this.conf.userPreferences.osuApi.key);
    }
    this.connect = () => this.irc.client.connect();
    this.disconnect = () => {
      store.dispatch({ type: 'DISCONNECT' });
      this.irc.client.disconnect();
    };
    //this.web = new WebUi(this.matchs, this.irc.makeMatch);
  }

  sendMapById(beatmapSetId, to, extra) {
    this.beatconnect
      .getBeatmapById(beatmapSetId)
      .then(response => getDlLink(response, true, extra))
      .then(link => this.irc.pm(to, link))
      .catch(err => {
        console.error(err);
        this.irc.pm(to, 'oops ! Cannot get beatmap');
      });
  }

  newMatch(id, matchName, ircRoom, creator, playerList) {
    console.log(`New match created : ${id} ${matchName} ${ircRoom} ${creator}`);
    let alreadyExist = false;
    this.matchs.forEach(match => {
      if (match.id === id) alreadyExist = true;
    });
    if (alreadyExist) return;
    const newMatch = new MpMatch(
      id,
      matchName,
      ircRoom,
      creator,
      this.irc,
      this.sendMapById,
      this.endMatch,
      this.conf.autoBeat,
    );
    if (playerList) {
      newMatch.players = playerList;
    }
    this.matchs.push(newMatch);
    //this.web.matchs = this.matchs;
    updateMatchsList(this.matchs);
    console.log(this.matchs);
  }

  endMatch(matchId) {
    this.matchs = this.matchs.filter(match => match.id !== matchId);
    updateMatchsList(this);
    console.log(`Current matchs : ${this.matchs}`);
  }

  newBeatmap(beatmapId, matchId) {
    this.osuApi
      .getSetId(beatmapId)
      .then(beatmap =>
        this.matchs.forEach(match => {
          if (match.id === matchId) {
            this.beatconnect.getBeatmapById(beatmap.beatmapset_id).then(response => {
              console.log('Beatconnect', response);
              beatmap = { ...beatmap, ...response };
              match.updateBeatmap(beatmap).then(() => updateMatchsList(this.matchs));
              console.log('osu', beatmap, this.matchs);
              return;
            });
          }
        }),
      )
      .catch(err => console.error(err));
  }

  np(beatmapId, from) {
    this.osuApi
      .getSetId(beatmapId)
      .then(res => this.sendMapById(res.beatmapset_id, from))
      .catch(err => console.error(err));
  }

  joinMatch(reqMatchId, from) {
    this.irc
      .joinMatch(reqMatchId)
      .then(({ matchId, playerList }) => this.newMatch(matchId, null, `#mp_${matchId}`, null, playerList))
      .catch(err => {
        console.error(err);
        if (from) this.irc.pm(from, 'Cannot find this room');
        store.dispatch({ type: 'ERROR', payload: reqMatchId });
      });
  }

  onMpMessage(matchId, msg) {
    this.matchs.map(match => {
      if (match.id === matchId) {
        const { rawMsg } = msg;
        const { rawCommand, args } = rawMsg;

        if (rawCommand === 'PRIVMSG' && args[0].includes('mp')) {
          if (args[1].includes('Beatmap changed to')) {
            const beatmapId = this.regExps[0]
              .exec(args[1])[1]
              .split('/')
              .pop();
            this.newBeatmap(beatmapId, matchId);
          } else if (args[1].includes('joined in')) {
            const player = args[1].split(' ').shift();
            match.playerJoin(player);
            updateMatchsList(this.matchs);
          } else if (args[1].includes('left the game.')) {
            const player = args[1].split(' ').shift();
            match.playerLeave(player);
            updateMatchsList(this.matchs);
          } else if (args[1].includes('became the host.')) {
            const player = args[1].split(' ').shift();
            match.host = player;
            updateMatchsList(this.matchs);
            console.log(`Host for ${match.matchName} is now ${player}`);
          } else if (
            args[1].includes('Room name: ') ||
            args[1].includes('Room name: ') ||
            args[1].includes('Beatmap: ') ||
            args[1].includes('Team mode: ') ||
            args[1].includes('Players: ') ||
            args[1].includes('Slot 1  ')
          ) {
            match.mpSettingsMessage(args[1]);
          }
        }
      }
    });
  }

  onMessage(from, channel, text, rawMsg) {
    if (!text.startsWith(this.prefix)) return;
    const params = text.split(' ');
    const command = params
      .shift()
      .split(this.prefix)
      .pop()
      .toLowerCase();
    if (this.ignoreList.includes(command)) return;
    let fromMp = null;
    if (channel.startsWith('#mp')) fromMp = channel;

    switch (command) {
      case this.commandsList[2]: // get
        if (!parseInt(params[0])) {
          this.irc.pm(fromMp || from, `${fromMp ? from : ''} You need to specify a beatmapSet id`);
          break;
        }
        this.sendMapById(params[0], from);
        break;
      case this.commandsList[5]: // infos
        this.irc.pm(
          fromMp || from,
          this.conf.commands
            .map(cmd => `[https://github.com/yadpe/beatconnect_irc_bot#readme ${cmd.command}] - ${cmd.description}`)
            .join('\n'),
        );
        break;
      case this.commandsList[0]: // createroom
        this.irc
          .makeMatch(params[0], from)
          .then(({ matchId, name, matchRoom, creator }) => this.newMatch(matchId, name, matchRoom, creator))
          .catch(err => {
            console.error(err);
            this.irc.pm(from, 'Unable to create the match, maybe you already have too many matchs currently open');
          });
        break;
      case this.commandsList[1]: // search
        this.beatconnect
          .searchBeatmap(params)
          .then(result => this.irc.pm(fromMp || from, result))
          .catch(err => console.error(err));
        break;
      case this.commandsList[4]: // beat
        if (!fromMp) {
          this.irc.pm(from, `You need to be in a multiplayer match to use this`);
          break;
        }
        const matchId = fromMp.split('_').pop();
        this.matchs.map(match => {
          if (match.id === matchId) this.sendMapById(match.beatmapset_id, fromMp, match.fullBeatmapData);
        });
        break;
      case this.commandsList[6]: // join
        if (!parseInt(params[0])) {
          this.irc.pm(from, 'You need to provide a valid match id');
          break;
        }
        this.joinMatch(params[0], from);
        break;
      default:
        this.irc.pm(fromMp || from, `${fromMp ? from : ''} Unknown command try: ${this.prefix}infos`);
        break;
    }
  }
}

export default Bot;
