const parse = require('./beatmapParse');
const path = require('path');
const fs = require('fs');

const osuSongsScan = osuDir => new Promise((resolve, reject) => {
  try {
    const songsDirectoryPath = path.join(osuDir, 'Songs');
    const output = {};

    fs.readdirSync(songsDirectoryPath)
      .forEach(beatmap => {
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
  console.log(msg, osuDir)
  switch (msg) {
    case 'start':
      osuSongsScan(osuDir)
      .then(songs => {
        console.log('sent results')
        process.send(JSON.stringify(songs))
      })
      .catch(err => {
        console.log('sent error')
        process.send(JSON.stringify({err}))
      })
  }
})


