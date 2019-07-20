import AudioPlayer from '../../utils/AudioPlayer'

const initialSettings = {
  volume: 50
}

export default (settings = initialSettings, { type, value }) => {
  switch (type) {
    case 'VOLUME':
      AudioPlayer.setVolume(value)
      return { ...settings, volume: value };
    default:
      return settings;
  }
}