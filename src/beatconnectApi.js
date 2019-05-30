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

const getDlLink = (beatmapInfos, pretty, extra) => {
    if (beatmapInfos.error) return 'Oops! Unable to recover this beatmap..'
    const {id, artist, title, unique_id} = beatmapInfos;
    if (extra){
        const status = {
            '4': 'Loved', '3': 'Qualified', '2': 'Approved', '1': 'Ranked', '0': 'Pending', '-1': 'WIP', '-2': 'Graveyard'
        }
        const { creator, approved, version, creator_id, bpm, max_combo, difficultyrating, diff_approach, mode } = extra;
        return `[${status[approved]}] [https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title} - ${version}] by [https://osu.ppy.sh/u/${creator_id} ${creator}] | BPM: ${bpm} | AR:${diff_approach} ${mode === 3 ? '' : '| Max combo: ' + max_combo}`;
    }
    if (pretty) return `[https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title}]`;
    return `https://beatconnect.io/b/${id}/${unique_id}`
};

module.exports = {BeatconnectApi, getDlLink};