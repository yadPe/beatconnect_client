/* eslint-disable array-callback-return */
import ElectronLog from 'electron-log';
import store from '../../shared/store';
import { updateSingleMatch } from '../actions';

const logger = ElectronLog.scope('bot-mp-settings');

export default function(msg) {
  const osuApi = store.getState().bot.instance.osuApi;

  let msgDatas = msg.split(',').map(data => data.split(/:(?!\/)/g));
  //msgDatas =  msgDatas
  logger.log(msgDatas);
  const mpData = {};
  // Players infos
  if (msgDatas[0].length === 1) {
    const player = {};
    const indexes = [
      [7, 'slot'],
      [17, 'readyState'],
      [46, 'userProfileUrl'],
      [62, 'userName'],
      [69, 'isHost'],
    ];
    indexes.map((index, i) => {
      player[index[1]] = msgDatas[0][0].slice(i > 0 ? indexes[i - 1][0] : 0, index[0]).replace(/\s/g, '');
    });
    if (!mpData.player) {
      mpData.player = [];
    }
    mpData.player.push(player);
    logger.log(player);
    if (player.isHost === '[Host]') {
      this.host = player.userName;
      updateSingleMatch(this);
    }

    return mpData;
  }

  // number of players and beatmapId
  // dont work when beatmap name contain ","
  if (msgDatas.length === 1) {
    let data = msgDatas[0];
    data = data.map(d =>
      d.includes('https://osu.ppy.sh/b/') ? /.*?(\d+)/i.exec(d.split(' ')[1])[1] : d.replace(/\s/g, ''),
    );
    mpData[data[0]] = data[1];
    logger.log(mpData);
    if (data[0] === 'Beatmap') {
      logger.log('osuApi', data[1]);
      osuApi.getSetId(data[1]).then(beatmap => {
        this.beatmapset_id = beatmap.beatmapset_id;
        this.fullBeatmapData = beatmap;
        updateSingleMatch(this);
        logger.log('osuapi', beatmap);
      });
    }
    return mpData;
  }

  msgDatas.map(data => {
    if (data[0] === 'Room name') {
      mpData[data[0]] = data[1];
      this.matchName = data[1];
    }
  });
  return mpData;
}
