export const getAudioFilePath = (songsPath, filePath) =>
  encodeURI(`file:///${songsPath}/${filePath}`.replace(/\\/g, '/'));
