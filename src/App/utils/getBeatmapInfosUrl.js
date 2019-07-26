export default ({ beatmapset_id, beatmap_id, mode, id }) => {
  const modes = {
    0: 'osu',
    1: 'taiko',
    2: 'ctb',
    3: 'mania'
  }
  if (beatmapset_id) return `https://osu.ppy.sh/beatmapsets/${beatmapset_id}/#${modes[mode]}/${beatmap_id}`
  if (id) return `https://osu.ppy.sh/beatmapsets/${id}`
}