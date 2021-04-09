const { Worker, isMainThread, parentPort } = require('worker_threads');
const { join } = require('path');
const { error } = require('electron-log');
const { readOsuDB, winTickToMs } = require('../helpers/osudb');

if (isMainThread) {
  const scanOsuDb = osuDbPath =>
    new Promise((resolve, reject) => {
      const worker = new Worker(__filename);
      const terminate = () => {
        worker.removeAllListeners();
        worker.terminate();
      };
      worker.on('message', data => {
        switch (data[0]) {
          case 'result':
            terminate();
            resolve(data[1]);
            break;
          case 'error':
            terminate();
            error(`[scanOsuDb thread]: ${data[1]}`);
            reject(data[1]);
            break;
          default:
            terminate();
            break;
        }
      });
      worker.postMessage(osuDbPath);
    });

  module.exports = scanOsuDb;
} else {
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
}
