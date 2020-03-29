import React, { useState } from 'react';
import renderIcons from '../../../helpers/renderIcons';
import { useAudioPlayer } from '../../../Providers/AudioPlayerProvider.bs';
import Button from '../Button';

const PreviewBeatmapBtn = ({ beatmapSetId, theme, setIsPLaying, songTitle }) => {
  const audioPlayer = useAudioPlayer();
  const [isPlayable, setIsPlayable] = useState(true);
  const isPlaying = audioPlayer.playingState.beatmapSetId === beatmapSetId;
  if (setIsPLaying) setIsPLaying(isPlaying);
  const playPreview = () => {
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId, setIsPlayable, songTitle);
  };
  return isPlayable ? (
    <Button color={theme.palette.primary.accent} onClick={playPreview}>
      {renderIcons({ name: `${isPlaying ? 'Pause' : 'Play'}`, style: theme.accentContrast })}
    </Button>
  ) : null;
};

export default PreviewBeatmapBtn;
