import React from 'react';
import renderIcons from '../../../helpers/renderIcons';
import useBeatmapSong from '../../../Providers/AudioPlayer/useBeatmapSong';
import Button from '../Button';

const PreviewBeatmapBtn = ({ beatmapSetId, theme, setIsPLaying, title, artist }) => {
  const { isPlaying, playPreview } = useBeatmapSong({ id: beatmapSetId, title, artist });
  if (setIsPLaying) setIsPLaying(isPlaying);
  return (
    <Button color={theme.palette.primary.accent} onClick={playPreview}>
      {renderIcons({ name: `${isPlaying ? 'Pause' : 'Play'}`, style: theme.accentContrast })}
    </Button>
  );
};

export default PreviewBeatmapBtn;
