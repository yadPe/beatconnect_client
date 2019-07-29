import React, { useState, useContext } from 'react';
import { Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'
import { AudioPlayerContext } from '../../../../Providers/AudioPlayerProvider';

const PreviewBeatmapBtn = ({ beatmapSetId, theme }) => {
  const audioPlayer = useContext(AudioPlayerContext);
  const preview = new Audio(`https://b.ppy.sh/preview/${beatmapSetId}.mp3`)
  const isPlaying = audioPlayer.isPlaying === beatmapSetId;
  const playPreview = () => {
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(preview, beatmapSetId)
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