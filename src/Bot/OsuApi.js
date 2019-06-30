//const fetch = require('node-fetch');

class OsuApi {
  constructor(key) {
    this.key = key;
    this.url = "https://osu.ppy.sh/api/";
  }

  request(query, params) {
    return fetch(`${this.url + query}?k=${this.key}${params ? params.map(p => `&` + p.param + '=' + p.value).join('') : ''}`, {mode: 'cors'})
      .then(res => res.json());
  }

  getMatch(matchId) {
    this.request('get_match', [{ param: 'mp', value: matchId }]);
  }

  getSetId(beatmapId) {
    return this.request('get_beatmaps', [{ param: 'b', value: beatmapId }])
      .then(res => {
        console.log(res[0].beatmapset_id)
        return res[0];
      });
  }
}

export default OsuApi;