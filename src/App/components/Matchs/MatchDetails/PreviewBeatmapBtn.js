import React, { useState } from 'react';
import { Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'

const PreviewBeatmapBtn = ({ beatmapSetId, theme }) => {
  const [ isPlaying, setIsPlaying ] = useState(false)
  const preview = new Audio(`https://b.ppy.sh/preview/${beatmapSetId}.mp3`)
  preview.volume = 0.5
  return (
    <Button
      push
      color={theme.color}
      onClick={() => preview.paused ? preview.play() : preview.pause()}>
      {renderIcons('Play', theme.style)}
    </Button>
  );
}

export default PreviewBeatmapBtn;