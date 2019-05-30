class MpMatch {
    constructor(id, matchName, ircRoom, creator, ircClient, sendBeatmap){
        this.id = id;
        this.matchName = matchName;
        this.ircRoom = ircRoom;
        this.players = [];
        this.beatmap = null;
        this.previousBeatmap = null;
        this.creator = creator;
        this.host = null;
        this.sendBeatmap = sendBeatmap;
        this.newPlayer = this.newPlayer.bind(this);
        this.invitePlayer = this.invitePlayer.bind(this);
        this.ircClient = ircClient;
        this.ircClient.onPlayerJoin = this.newPlayer;
        this.creatorInvited = false;
        this.invitePlayer(this.creator);
    }

    updateBeatmap(beatmap){
        const {beatmapset_id} = beatmap;
        this.beatmap = beatmapset_id;
        if (this.previousBeatmap !== beatmapset_id) this.sendBeatmap(beatmapset_id, this.ircRoom, beatmap);
        this.previousBeatmap = beatmapset_id;
    }

    invitePlayer(player){
        this.ircClient.pm(this.ircRoom, `!mp invite ${player}`)
    }

    makeHost(player){
        this.ircClient.pm(this.ircRoom, `!mp host ${player}`)
    }

    newPlayer(player, matchId){
        if (!this.creatorInvited && this.creator === player) {this.makeHost(player); this.creatorInvited = true};
        this.players.push(player);
    }
}

module.exports = MpMatch;