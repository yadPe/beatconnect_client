const parse = require('./beatmapParse');
const path = require('path');
const fs = require('fs');

const osuSongsScan = songsDirectoryPath => new Promise((resolve, reject) => {
  try {
    const output = {};
    const beatmaps = fs.readdirSync(songsDirectoryPath)
    const beatmapsCount = beatmaps.length
    beatmaps.forEach((beatmap, i) => {
      if (i % 50 === 0 ) {
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
            const { Metadata } = parse(data)
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

process.on('message', (data) => {
  const { msg, osuDir } = JSON.parse(data)
  switch (msg) {
    case 'start':
      osuSongsScan(osuDir)
        .then(songs => {
          // console.log('osuSongsScan: sent results', songs)
          process.send(JSON.stringify({ results: songs }))
        })
        .catch(err => {
          console.log('osuSongsScan: sent error', err)
          process.send(JSON.stringify({ err }))
        })
      break
    default:
      break
  }
})


