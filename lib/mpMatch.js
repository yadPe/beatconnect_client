const { getDlLink } = require('./beatconnectApi');

class MpMatch {
    constructor(id, matchName, ircRoom, creator, ircClient, sendBeatmap){
        this.id = id;
        this.matchName = matchName;
        this.ircRoom = ircRoom;
        this.ircClient = ircClient;
        this.players = [];
        this.beatmap = null;
        this.previousBeatmap = null;
        this.sendBeatmap = sendBeatmap;
        this.creator = creator;
        this.host = null;
        this.invitePlayer = this.invitePlayer.bind(this);
        this.invitePlayer(this.creator);
    }

    updateBeatmap(beatmap){
        //if (!this.previousBeatmap) this.previousBeatmap = beatmap;
        console.log(beatmap)
        this.beatmap = beatmap;
        if (this.previousBeatmap !== beatmap) this.sendBeatmap(beatmap, this.ircRoom);
        this.previousBeatmap = beatmap;
    }

    invitePlayer(player){
        this.ircClient.pm(this.ircRoom, `!mp invite ${player}`)
    }

    makeHost(player){
        this.ircClient.pm(this.ircRoom, `!mp host ${player}`)
    }
}

module.exports = MpMatch;