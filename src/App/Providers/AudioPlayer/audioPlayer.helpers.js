export const getAudioFilePath = (songsPath, filePath) =>
  encodeURI(`file:///${songsPath}/${filePath}`.replace(/\\/g, '/'));

export const makePlaylist = (beatmapCollection = [], osuSongPath, historyObject = null) =>
  beatmapCollection.map(({ id, title, artist, audioPath }) => ({
    id,
    title,
    artist,
    path: getAudioFilePath(osuSongPath, historyObject === null ? audioPath : historyObject[id].audioPath),
  }));
