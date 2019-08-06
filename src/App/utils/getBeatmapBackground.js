export default (beatmapSetId, beatmapId) => new Promise((resolve, reject) => {
  const bg = new Image
  bg.onload = e => resolve(e.target.src);
  bg.onerror = () => reject('Cannot get background');
  bg.src = `https://beatconnect.io/bg/${beatmapSetId}/${beatmapId}/`;
});