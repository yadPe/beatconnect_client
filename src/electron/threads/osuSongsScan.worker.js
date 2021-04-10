const { parentPort } = require('worker_threads');
const { join } = require('path');
const { readOsuDB, winTickToMs } = require('../helpers/osudb');

parentPort.on('message', osuDbPath => {
  if (osuDbPath) {
    try {
      const re = readOsuDB(osuDbPath);
      const beatmaps = {};
      let overallDuration = 0;
      let overallUnplayedCount = 0;
      re.beatmaps.forEach(beatmap => {
        if (beatmap.beatmapset_id === -1) return;
        if (beatmaps[beatmap.beatmapset_id]) return;
        if (beatmap.unplayed) overallUnplayedCount += 1;
        overallDuration += beatmap.total_time;
        beatmaps[beatmap.beatmapset_id] = {
          id: beatmap.beatmapset_id,
          date: winTickToMs(beatmap.last_modification_time),
          title: beatmap.song_title,
          artist: beatmap.artist_name,
          creator: beatmap.creator_name,
          isUnplayed: beatmap.unplayed,
          md5: beatmap.md5,
          audioPath: join(beatmap.folder_name, beatmap.audio_file_name),
          previewOffset: beatmap.preview_offset,
        };
      });
      parentPort.postMessage(['result', [beatmaps, overallDuration, overallUnplayedCount]]);
    } catch (e) {
      parentPort.postMessage(['error', e.message]);
    }
  }
});
