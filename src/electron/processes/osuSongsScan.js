const path = require('path');
const fs = require('fs');
const { join } = require('path');
const { log } = require('electron-log');
const parser = require('../helpers/beatmapParser');
const { readOsuDB, winTickToMs } = require('../helpers/osudb');

const osuSongsScan = songsDirectoryPath =>
  new Promise((resolve, reject) => {
    try {
      const output = {};
      const beatmaps = fs.readdirSync(songsDirectoryPath);
      const beatmapsCount = beatmaps.length;
      beatmaps.forEach((beatmap, i) => {
        if (i % 50 === 0) {
          const progress = (i / beatmapsCount).toFixed(2);
          process.send(JSON.stringify({ status: progress }));
        }
        const beatmapPath = path.join(songsDirectoryPath, beatmap);
        const dirStats = fs.lstatSync(beatmapPath);
        const isDirExists = fs.existsSync(beatmapPath) && dirStats.isDirectory();
        if (isDirExists) {
          const date = dirStats.mtimeMs;
          const assets = fs.readdirSync(beatmapPath);
          for (let j = 0; j < assets.length; j++) {
            if (assets[j].split('.').pop() === 'osu') {
              const data = fs.readFileSync(path.join(beatmapPath, assets[j]), 'utf8');
              const { Metadata } = parser(data);
              if (!(typeof Metadata === 'undefined')) {
                const { BeatmapSetID, Title, Artist } = Metadata;
                if (BeatmapSetID && BeatmapSetID !== '-1' && BeatmapSetID !== '0')
                  output[BeatmapSetID] = { id: BeatmapSetID, name: `${Title} | ${Artist}`, date };
                break;
              }
            }
          }
        }
      });
      resolve(output);
    } catch (err) {
      reject(err);
    }
  });

const osuDbScan = osuPath => {
  const re = readOsuDB(`${osuPath}/osu!.db`);
  const out = {};
  let overallDuration = 0;
  let overallUnplayedCount = 0;
  re.beatmaps.forEach(beatmap => {
    if (beatmap.beatmapset_id === -1) return;
    if (out[beatmap.beatmapset_id]) return;
    if (beatmap.unplayed) overallUnplayedCount += 1;
    overallDuration += beatmap.total_time;
    out[beatmap.beatmapset_id] = {
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

  return [out, overallDuration, overallUnplayedCount];
};

process.on('message', async data => {
  const { msg, osuPath, osuSongsPath, allowLegacy } = JSON.parse(data);
  let beatmaps = [];
  let overallDuration = 0;
  let overallUnplayedCount = 0;
  switch (msg) {
    case 'start':
      try {
        if (osuPath) {
          [beatmaps, overallDuration, overallUnplayedCount] = osuDbScan(osuPath);
        }
        // Fallback to direcrory scan if failed to read osu db
        if (!Object.keys(beatmaps).length && allowLegacy) beatmaps = await osuSongsScan(osuSongsPath);
      } catch (err) {
        log.error(`OsuSongScan: ${JSON.stringify(err.message)}`);
        process.send(JSON.stringify({ err: err.message }));
        throw err;
      }
      process.send(JSON.stringify({ results: beatmaps, overallDuration, overallUnplayedCount }));
      break;
    default:
      break;
  }
});
