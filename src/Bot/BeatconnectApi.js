import ElectronLog from 'electron-log';
import config from '../shared/config';

const logger = ElectronLog.scope('bot-beatconnect-api');

const BeatmapStatus = Object.freeze({
  '4': 'Loved',
  '3': 'Qualified',
  '2': 'Approved',
  '1': 'Ranked',
  '0': 'Pending',
  '-1': 'WIP',
  '-2': 'Graveyard',
});

class BeatconnectApi {
  constructor(key) {
    this.key = key;
    this.url = 'https://beatconnect.io/api';
    this.status = BeatmapStatus;
  }

  getBeatmapById(beatmapId) {
    logger.log('getBeatmapById', beatmapId);
    return fetch(config.api.getBeatmapById(beatmapId), { mode: 'cors' })
      .then(res => res.json())
      .catch(logger.error));
  }

  searchBeatmap(rawQuery, page) {
    logger.log('searching ' + query);
    const query = encodeURI(rawQuery);
    return fetch(config.api.searchBeatmaps(query, page))
      .then(res => res.json())
      .then(results => {
        const { beatmaps, max_page } = results;
        const totalOccurences = max_page / 1 > 0 ? (beatmaps.length * max_page) / 1 : beatmaps.length;
        const top = beatmaps.slice(0, 4);
        return (
          top
            .map(
              beatmap =>
                `[${this.status[beatmap.ranked]}] ${getDlLink(beatmap, true)} by [https://osu.ppy.sh/u/${
                  beatmap.user_id
                } ${beatmap.creator}]`,
            )
            .join('\n') +
          `\nFound [https://beatconnect.io/?q=${query} ${totalOccurences} ${
            totalOccurences > 1 ? 'occurences]' : 'occurence]'
          }`
        );
      })
      .catch(err => ElectronLog.error());
  }
}

const getDlLink = (beatmapInfos, pretty, extra) => {
  if (beatmapInfos.error) throw new Error(beatmapInfos.error); // Need Test
  const { id, artist, title, unique_id } = beatmapInfos;

  if (extra) {
    const { creator, approved, version, creator_id, bpm, max_combo, diff_approach } = extra;
    return `[${BeatmapStatus[approved] || ''}] [https://beatconnect.io/b/${id}/${unique_id} ${artist || ''} - ${title ||
      ''}  [${version || ''}]] by [https://osu.ppy.sh/u/${creator_id} ${creator || 'peppy'}] | BPM ${bpm ||
      0} | AR ${diff_approach || 0} ${max_combo ? '| Max combo: ' + max_combo : ''}`;
  }
  if (pretty) return `[https://beatconnect.io/b/${id}/${unique_id} ${artist} - ${title}]`;
  return `https://beatconnect.io/b/${id}/${unique_id}`;
};

export { BeatconnectApi, getDlLink };
