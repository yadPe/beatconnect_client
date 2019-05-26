const fetch = require('node-fetch');

class BeatconnectApi {
    constructor() {
        this.key = require('../conf').beatconnectAPI.key;
        this.url = "https://beatconnect.io/api/";
    }

    getBeatmapById(beatmapId) {
        return fetch(`${this.url}/beatmap/${beatmapId}/?token=${this.key}`).then(res => res.json()).catch(err => console.error(err));
    }

    searchBeatmap(query) {
        query = query.join(' ')
        console.log('searching ' + query)
        return fetch(`${this.url}/search/?token=${this.key}&q=${query}`)
        .then(res => res.json())
        .then(results => {
            const { beatmaps, max_page } = results;
            const totalOccurences = max_page / 1 > 0 ? beatmaps.length * max_page / 1 : beatmaps.length;
            const top = beatmaps.slice(0, 4);
            return top.map(beatmap => `${getDlLink(beatmap, true)}`).join('\n') + `\nFound ${totalOccurences} ${totalOccurences > 1 ? 'occurences' : 'occurence' }`
        })
        .catch(err => console.error(err));
    }
}

const getDlLink = (beatmapInfos, pretty) => {
    if (beatmapInfos.error) return 'Oops! Unable to recover this beatmap..'
    const {id, artist, title, unique_id} = beatmapInfos;
    if (pretty) return `[https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title}]`;
    return `https://beatconnect.io/b/${id}/${unique_id}`
};

module.exports = {BeatconnectApi, getDlLink};