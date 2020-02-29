import React, { useState, useContext } from 'react';
import renderIcons from '../../../helpers/renderIcons';
import { AudioPlayerContext } from '../../../Providers/AudioPlayerProvider';
import Button from '../Button';

const PreviewBeatmapBtn = ({ beatmapSetId, theme, setIsPLaying }) => {
  const audioPlayer = useContext(AudioPlayerContext);
  const [isPlayable, setIsPlayable] = useState(true);
  const isPlaying = audioPlayer.isPlaying === beatmapSetId;
  if (setIsPLaying) setIsPLaying(isPlaying);
  const playPreview = () => {
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId, setIsPlayable);
  };
  return isPlayable ? (
    <Button color={theme.palette.primary.accent} onClick={playPreview}>
      {renderIcons({ name: `${isPlaying ? 'Pause' : 'Play'}`, style: theme.accentContrast })}
    </Button>
  ) : null;
};

export default PreviewBeatmapBtn;
