const log = require('electron-log');
const path = require('path');
const fs = require('fs');
const parser = require('./beatmapParser');
const { readOsuDB } = require('./osudb');

const osuSongsScan = songsDirectoryPath => new Promise((resolve, reject) => {
  try {
    const output = {};
    const beatmaps = fs.readdirSync(songsDirectoryPath)
    const beatmapsCount = beatmaps.length
    beatmaps.forEach((beatmap, i) => {
      if (i % 50 === 0) {
        const progress = (i / beatmapsCount).toFixed(2)
        process.send(JSON.stringify({ status: progress }))
      }
      const beatmapPath = path.join(songsDirectoryPath, beatmap);
      const dirStats = fs.lstatSync(beatmapPath)
      const isDirExists = fs.existsSync(beatmapPath) && dirStats.isDirectory()
      if (isDirExists) {
        const date = dirStats.mtimeMs;
        const assets = fs.readdirSync(beatmapPath)
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].split('.').pop() === 'osu') {
            const data = fs.readFileSync(path.join(beatmapPath, assets[i]), 'utf8')
            const { Metadata } = parser(data)
            if (!(typeof Metadata === 'undefined')) {
              const { BeatmapSetID, Title, Artist } = Metadata;
              if (BeatmapSetID && BeatmapSetID !== '-1' && BeatmapSetID !== '0')
                output[BeatmapSetID] = { id: BeatmapSetID, name: `${Title} | ${Artist}`, date }
              break
            }
          }
        }
      }
    });
    resolve(output)
  } catch (err) {
    reject(err)
  }
})

const osuDbScan = osuPath => new Promise((resolve) => {
  readOsuDB(`${osuPath}/osu!.db`).then(({ beatmaps }) => {
    const out = {};
    beatmaps.forEach(beatmap => {
      if (beatmap.beatmapSetId === -1) return
      out[beatmap.beatmapSetId] = {
        id: beatmap.beatmapSetId,
        date: beatmap.lastModificationMs,
        name: `${beatmap.title} | ${beatmap.artist}`,
        creator: beatmap.creator,
        isUnplayed: beatmap.isUnplayed === 1,
        hash: beatmap.md5
      }
    })
    resolve(out);
  }).catch(() => resolve({}))
});

// eslint-disable-next-line consistent-return
process.on('message', async (data) => {
  const { msg, osuPath, osuSongsPath, allowLegacy } = JSON.parse(data)
  let beatmaps = [];
  switch (msg) {
    case 'start':
      try {
        if (osuPath) beatmaps = await osuDbScan(osuPath);
        if (!Object.keys(beatmaps).length && allowLegacy) beatmaps = await osuSongsScan(osuSongsPath);
      } catch (err) {
        log.error(`OsuSongScan: ${JSON.stringify(err)}`)
        return process.send(JSON.stringify({ err }))
      }
      process.send(JSON.stringify({ results: beatmaps }));
      break
    default:
      break
  }
})


