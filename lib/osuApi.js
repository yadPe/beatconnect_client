const fetch = require('node-fetch');

class OsuApi {
    constructor() {
        this.key = require('../conf').osuApi.key;
        this.url = "https://osu.ppy.sh/api/";
    }

    request(query, params) {
        console.log(`${this.url + query}?k=${this.key}${params ? params.map(p => `&` + p.param + '=' + p.value).join('') : ''}`)
        return fetch(`${this.url + query}?k=${this.key}${params ? params.map(p => `&` + p.param + '=' + p.value).join('') : ''}`)
        .then(res => res.json()).then(res => {
            console.log(res)
            return res;
        });
    }

    getMatch(matchId) {
        this.request('get_match', [{param: 'mp', value: matchId}]);
    }

    getSetId(beatmapId){
        return this.request('get_beatmaps', [{param: 'b', value: beatmapId}])
        .then(res => {
            console.log(res[0].beatmapset_id)
            return res[0].beatmapset_id;
        });
    }
}

// const api = new osuApi();
// api.getMatch('52058678');
module.exports = OsuApi;