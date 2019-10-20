import React, { useState, useContext } from 'react';
import { Button } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons';
import { AudioPlayerContext } from '../../../../Providers/AudioPlayerProvider';

const PreviewBeatmapBtn = ({ beatmapSetId, theme, setIsPLaying }) => {
  const audioPlayer = useContext(AudioPlayerContext);
  const [isPlayable, setIsPlayable] = useState(true);
  const isPlaying = audioPlayer.isPlaying === beatmapSetId;
  if (setIsPLaying) setIsPLaying(isPlaying);
  const playPreview = () => {
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId, setIsPlayable);
  };
  return isPlayable ? (
    <Button push color={theme.palette.primary.accent} onClick={playPreview}>
      {renderIcons(`${isPlaying ? 'Pause' : 'Play'}`, theme.style)}
    </Button>
  ) : null;
};

export default PreviewBeatmapBtn;
