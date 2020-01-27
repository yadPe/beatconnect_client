import { getDlLink } from '../BeatconnectApi';
import mpSettingsMessage from '../msg/mpSettings';
import { updateSingleMatch } from '../actions';

class MpMatch {
  constructor(id, matchName, ircRoom, creator, ircClient, sendBeatmap, destroy, autoBeat) {
    this.id = id;
    this.destroy = destroy;
    this.matchName = matchName;
    this.ircRoom = ircRoom;
    this.creator = creator;
    this.players = [];
    this.beatmapset_id = null;
    this.fullBeatmapData = null;
    this.previousBeatmap = null;
    this.host = null;
    this.timeout = null;
    this.autoBeat = autoBeat;
    this.sendBeatmap = sendBeatmap;
    this.playerJoin = this.playerJoin.bind(this);
    this.invitePlayer = this.invitePlayer.bind(this);
    this.playerLeave = this.playerLeave.bind(this);
    this.ircClient = ircClient;
    this.creatorJoined = false;
    this.startTime = Date.now();
    this.mpSettingsMessage = mpSettingsMessage.bind(this);
    if (this.creator) {
      this.invitePlayer(this.creator);
      this.matchType = 'tournament';
    } else {
      this.welcome('existingMatch');
      this.matchType = 'standard';
    }
  }

  updateBeatmap(beatmap) {
    return new Promise(resolve => {
      const { beatmapset_id } = beatmap;
      this.beatmapset_id = beatmapset_id;
      this.fullBeatmapData = { ...beatmap, beatconnectDlLink: getDlLink(beatmap) };
      if (this.previousBeatmap !== beatmapset_id && this.autoBeat)
        this.sendBeatmap(beatmapset_id, this.ircRoom, beatmap);
      this.previousBeatmap = beatmapset_id;
      resolve();
    });
  }

  invitePlayer(player) {
    this.ircClient.pm(this.ircRoom, `!mp invite ${player}`);
  }

  makeHost(player) {
    if (!this.players.includes(player) && !player === this.creator) return;
    this.ircClient.pm(this.ircRoom, `!mp host ${player}`);
    this.host = player;
  }

  kick(player) {
    if (!this.players.includes(player)) return;
    this.ircClient.pm(this.ircRoom, `!mp kick ${player}`);
  }

  abort() {
    this.ircClient.pm(this.ircRoom, `!mp abort`);
  }

  beatmap(beatmapId, gameMode) {
    this.ircClient.pm(this.ircRoom, `!mp map ${beatmapId} ${gameMode}`);
  }

  playerJoin(player) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (!this.creatorJoined && this.creator === player) {
      this.makeHost(player);
      this.creatorJoined = true;
      this.welcome('newMatch');
    } else if (this.players.length === 0) this.makeHost(player);
    this.players.push(player);
    console.log(this.matchName + ' players: ' + this.players);
  }

  playerLeave(player) {
    this.players = this.players.filter(p => p !== player);
    if (this.players.length > 0 && this.host === player) {
      this.makeHost(this.players[0]);
    } else {
      if (this.matchType === 'tournament' && !this.timeout) {
        this.timeout = setTimeout(() => {
          this.ircClient.pm(this.ircRoom, '!mp close');
          this.destroy(this.id);
        }, 60000 * 0.3);
      } else {
        this.destroy(this.id);
      }
    }
    console.log(this.matchName + ' players: ' + this.players);
  }

  start() {
    this.ircClient.pm(this.ircRoom, '!mp start');
  }

  close() {
    this.ircClient.pm(this.ircRoom, '!mp close');
  }

  welcome(newMatchType) {
    if (newMatchType === 'existingMatch') this.ircClient.pm(this.ircRoom, `!mp settings BEATCONEEEEEEECT`);
    else
      this.ircClient.pm(
        this.ircRoom,
        `Welcome! The room is currently locked by password, invite your friends or let peoples join by removing the password`,
      );
  }

  getCurrentBeatmap = () => this.beatmapset_id;

  toggleAutoBeat = () => {
    this.autoBeat = !this.autoBeat;
    updateSingleMatch(this);
  };
}

export default MpMatch;
