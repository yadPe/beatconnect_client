const fetch = require('node-fetch');

class OsuApi {
    constructor() {
        this.key = require('../conf').osuApi.key;
        this.url = "https://osu.ppy.sh/api/";
    }

    request(query, params) {
        fetch(`${this.url + query}?k=${this.key}${params ? params.map(p => `&` + p.param + '=' + p.value).join('') : ''}`)
        .then(res => res.json())
        .then(resJson => console.log(resJson))
        .catch(err => console.log(err))
    }

    getMatch(matchId) {
        this.request('get_match', [{param: 'mp', value: matchId}])
    }
}

// const api = new osuApi();
// api.getMatch('52058678');
module.exports = OsuApi;