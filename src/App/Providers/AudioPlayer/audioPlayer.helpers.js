export const getAudioFilePath = (songsPath, filePath) =>
  encodeURI(`file:///${songsPath}/${filePath}`.replace(/\\/g, '/'));

export const makePlaylist = (beatmapCollection = [], osuSongPath, historyObject) =>
  beatmapCollection.map(({ id: mapId, title: mapTitle, artist: mapArtist }) => ({
    id: mapId,
    title: mapTitle,
    artist: mapArtist,
    path: getAudioFilePath(osuSongPath, historyObject[mapId].audioPath),
  }));
