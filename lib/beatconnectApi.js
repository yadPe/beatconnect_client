const fetch = require('node-fetch');

class BeatconnectApi {
    constructor() {
        this.key = require('../conf').beatconnectAPI.key;
        this.url = "https://beatconnect.io/api/";
    }

    getBeatmapById(beatmapId) {
        return fetch(`${this.url}/beatmap/${beatmapId}/?token=${this.key}`).then(res => res.json()).catch(err => console.error(err));
    }
}

const getDlLink = (beatmapInfos, pretty) => {
    if (beatmapInfos.error) return 'Oops! Unable to recover this beatmap..'
    const {id, artist, title, unique_id} = beatmapInfos;
    if (pretty) return `[https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title}]`;
    return `https://beatconnect.io/b/${id}/${unique_id}`
};

module.exports = {BeatconnectApi, getDlLink};