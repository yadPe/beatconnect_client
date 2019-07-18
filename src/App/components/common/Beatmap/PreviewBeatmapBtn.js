import React, { useState } from 'react';
import { Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'
import AudioPlayer from '../../../utils/AudioPlayer'

const PreviewBeatmapBtn = ({ beatmapSetId, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const preview = new Audio(`https://b.ppy.sh/preview/${beatmapSetId}.mp3`)
  const playPreview = () => {
    isPlaying ? AudioPlayer.toggle() : AudioPlayer.setAudio(preview, setIsPlaying)
    setIsPlaying(!isPlaying)
  }
  return (
    <Button
      push
      color={theme.color}
      onClick={playPreview}>
      {renderIcons(`${isPlaying ? 'Pause' : 'Play'}`, theme.style)}
    </Button>
  );
}

export default PreviewBeatmapBtn;