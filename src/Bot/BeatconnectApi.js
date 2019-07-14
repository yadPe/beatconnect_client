class BeatconnectApi {
  constructor(key) {
    this.key = key;
    this.url = "https://beatconnect.io/api/";
    this.status = {
      '4': 'Loved', '3': 'Qualified', '2': 'Approved', '1': 'Ranked', '0': 'Pending', '-1': 'WIP', '-2': 'Graveyard'
    }
  }

  getBeatmapById(beatmapId) {
    return fetch(`${this.url}/beatmap/${beatmapId}/?token=${this.key}`, { mode: 'cors' }).then(res => res.json()).catch(err => console.error(err));
  }

  searchBeatmap(query) {
    query = query.join('%20')
    console.log('searching ' + query)
    return fetch(`${this.url}/search/?token=${this.key}&q=${query}`)
      .then(res => res.json())
      .then(results => {
        const { beatmaps, max_page } = results;
        const totalOccurences = max_page / 1 > 0 ? beatmaps.length * max_page / 1 : beatmaps.length;
        const top = beatmaps.slice(0, 4);
        return top.map(beatmap => `[${this.status[beatmap.ranked]}] ${getDlLink(beatmap, true)} by [https://osu.ppy.sh/u/${beatmap.user_id} ${beatmap.creator}]`).join('\n') + `\nFound [https://beatconnect.io/?q=${query} ${totalOccurences} ${totalOccurences > 1 ? 'occurences]' : 'occurence]'}`
      })
      .catch(err => console.error(err));
  }
}

const getDlLink = (beatmapInfos, pretty, extra) => {
  if (beatmapInfos.error) throw new Error(beatmapInfos.error) // Need Test 
  const { id, artist, title, unique_id } = beatmapInfos;
  const status = {
    '4': 'Loved', '3': 'Qualified', '2': 'Approved', '1': 'Ranked', '0': 'Pending', '-1': 'WIP', '-2': 'Graveyard'
  };
  if (extra) {
    const { creator, approved, version, creator_id, bpm, max_combo, difficultyrating, diff_approach, mode } = extra;
    return `[${status[approved] || ''}] [https://beatconnect.io/b/${id}/${unique_id} ${artist || ''} - ${title || ''}  [${version || ''}]] by [https://osu.ppy.sh/u/${creator_id} ${creator || 'peppy'}] | BPM ${bpm || 0} | AR ${diff_approach || 0} ${max_combo ? '| Max combo: ' + max_combo : ''}`;
  }
  if (pretty) return `[https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title}]`;
  return `https://beatconnect.io/b/${id}/${unique_id}`
};

export { BeatconnectApi, getDlLink };