export default function(msg) {
  let msgDatas = msg.split(',').map((data) => data.split(/:(?!\/)/g));
  //msgDatas =  msgDatas
  console.log(msgDatas);
  const mpData = {};
  // Players infos 
  if (msgDatas[0].length === 1) {
    const player = {}
    const indexes = [
      [7, 'slot'],
      [17, 'readyState'],
      [46, 'userProfileUrl'],
      [62, 'userName'],
      [69, 'isHost']
    ]
    indexes.map((index, i) => {
      player[index[1]] = msgDatas[0][0].slice(i > 0 ? indexes[i - 1][0] : 0, index[0]).replace(/\s/g, '')
    })
    if (!mpData.player) {
      mpData.player = [];
    }
    mpData.player.push(player);
    console.log(player)

    return mpData;
  }

  // number of players and beatmapId
  if (msgDatas.length === 1) {
    let data = msgDatas[0];
    data = data.map(d => d.includes('https://osu.ppy.sh/b/') ? /.*?(\d+)/i.exec(d.split(' ')[1])[1] : d.replace(/\s/g, ''))
    mpData[data[0]] = data[1]
    console.log(mpData)
    if (data[0] === 'Beatmap'){
      // this.beatmapset_id = data[1]
    }
    return mpData
  }

  msgDatas.map(data => {
    if (data[0] === 'Room name') {
      mpData[data[0]] = data[1]
      this.matchName = data[1]
    }
  })
  return mpData
}
