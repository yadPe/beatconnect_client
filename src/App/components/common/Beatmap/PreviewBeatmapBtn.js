import React, { useState, useContext } from 'react';
import { Button } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'
import { AudioPlayerContext } from '../../../../Providers/AudioPlayerProvider';

const PreviewBeatmapBtn = ({ beatmapSetId, theme, setIsPLaying }) => {
  const audioPlayer = useContext(AudioPlayerContext);
  const [isPlayable, setIsPlayable] = useState(true);
  const preview = new Audio(`https://b.ppy.sh/preview/${beatmapSetId}.mp3`);
  preview.onerror = () => setIsPlayable(false);
  const isPlaying = audioPlayer.isPlaying === beatmapSetId;
  if (setIsPLaying) setIsPLaying(isPlaying);
  const playPreview = () => {
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(preview, beatmapSetId)
  }
  return (
    isPlayable ?
      <Button
        push
        color={theme.color}
        onClick={playPreview}>
        {renderIcons(`${isPlaying ? 'Pause' : 'Play'}`, theme.style)}
      </Button>
      : null
  );
}

export default PreviewBeatmapBtn;