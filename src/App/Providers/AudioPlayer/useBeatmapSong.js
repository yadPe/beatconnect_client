import { useSelector } from 'react-redux';
import { remote } from 'electron';
import { getOsuSongPath } from '../../modules/Settings/reducer/selectors';
import { useDownloadHistory } from '../HistoryProvider';
import { getAudioFilePath, makePlaylist } from './audioPlayer.helpers';
import { useAudioPlayer } from './AudioPlayerProvider.bs';

const { trackEvent } = remote.getGlobal('tracking');

const useBeatmapSong = ({ id, title, artist, collectionName }, mode = '', items = []) => {
  const isLibraryMode = mode === 'library';

  const osuSongPath = useSelector(getOsuSongPath);
  const history = useDownloadHistory();
  const audioPlayer = useAudioPlayer();

  const isDownloaded = history.contains(id);
  const audioPath =
    osuSongPath &&
    isDownloaded &&
    history.history[id].audioPath &&
    getAudioFilePath(osuSongPath, history.history[id].audioPath);
  const previewTime = audioPath && history.history[id].previewOffset / 1000;

  const isSelected = audioPlayer.playingState.beatmapSetId === id;
  const isPlaying = audioPlayer.playingState.isPlaying && isSelected;

  const playPreview = () => {
    if (isSelected) audioPlayer.togglePlayPause();
    else if (isLibraryMode) {
      audioPlayer.setAudio({ id, title, artist }, audioPath || undefined);
      audioPlayer.setPlaylist(makePlaylist(items, osuSongPath, history.history), collectionName);
    } else audioPlayer.setAudio({ id, title, artist }, audioPath || undefined, previewTime || undefined);
    trackEvent('beatmapPreview', 'play', mode);
  };

  return {
    isSelected,
    isPlaying,
    playPreview,
  };
};

export default useBeatmapSong;
