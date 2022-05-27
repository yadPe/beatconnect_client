const { Worker } = require('worker_threads');
const { join } = require('path');
const { error } = require('electron-log');
const { readLazerDb } = require('../helpers/osuLazer');

const scanOsuDb = (osuDbPath, isLazer = false) =>
  new Promise((resolve, reject) => {
    switch (isLazer) {
      case true: {
        readLazerDb('/Users/ypetitot/.local/share/osu/client.realm')
          .then(beatmaps => {
            const beatmapsList = {};

            beatmaps.forEach(beatmap => {
              if (beatmap.BeatmapSet.OnlineID === -1) return;

              if (beatmapsList[beatmap.BeatmapSet.OnlineID]) {
                beatmapsList[beatmap.BeatmapSet.OnlineID].mapsMd5.push(beatmap.MD5Hash);
                return;
              }
              beatmapsList[beatmap.BeatmapSet.OnlineID] = {
                id: beatmap.BeatmapSet.OnlineID,
                date: beatmap.BeatmapSet.DateAdded.getTime(),
                title: beatmap.Metadata.Title,
                artist: beatmap.Metadata.Artist,
                creator: '',
                isUnplayed: false,
                mapsMd5: [beatmap.MD5Hash],
                audioPath: '',
                previewOffset: beatmap.Metadata.PreviewTime,
                songDuration: 0,
              };
            });

            resolve([beatmapsList]);
          })
          .catch(reject);

        break;
      }
      case false: {
        const worker = new Worker(join(__dirname, './osuSongsScan.worker.js'));
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
        worker.postMessage({ osuDbPath, isLazer });
        break;
      }
      default:
        break;
    }
  });

module.exports = scanOsuDb;
