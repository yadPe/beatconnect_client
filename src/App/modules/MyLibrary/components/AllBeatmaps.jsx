/* eslint-disable no-continue */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getListCoverUrl } from '../../../../shared/PpyHelpers.bs';
import { makePlaylist, getAudioFilePath } from '../../../Providers/AudioPlayer/audioPlayer.helpers';
import { useAudioPlayer } from '../../../Providers/AudioPlayer/AudioPlayerProvider.bs';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { getOsuSongPath } from '../../Settings/reducer/selectors';
import { useCollectionStyle } from './Collection';
import CollectionCover from './CollectionCover';

const COLLECTION_NAME = 'All';
const AllBeatmapsCollection = ({ select }) => {
  const { ready, history } = useDownloadHistory();
  const classes = useCollectionStyle();
  const osuSongPath = useSelector(getOsuSongPath);
  const audioPlayer = useAudioPlayer();

  const [artWorks, setArtWorks] = useState([]);
  const [beatmapsCount, setBeatmapsCount] = useState(0);

  const getCoverArtworks = useCallback(() => {
    const beatmaps = Object.values(history);
    setBeatmapsCount(() => beatmaps.length);
    const artworksLimit = Math.min(beatmaps.length >= 4 ? 4 : 1, beatmaps.length);
    return beatmaps.slice(0, artworksLimit).map(beatmap => getListCoverUrl(beatmap.id));
  }, [ready]);

  useEffect(() => {
    setArtWorks(() => getCoverArtworks());
  }, [ready]);

  const isPlaying = audioPlayer.playingState.isPlaying && audioPlayer.playlistID === COLLECTION_NAME;
  const handlePlay = () => {
    if (audioPlayer.playlistID === COLLECTION_NAME) {
      audioPlayer.togglePlayPause();
      return;
    }
    const beatmaps = Object.values(history);
    if (!beatmaps.length) return;
    audioPlayer.setAudio(
      { id: beatmaps[0].id, title: beatmaps[0].title, artist: beatmaps[0].artist },
      () => {},
      getAudioFilePath(osuSongPath, beatmaps[0].audioPath) || undefined,
    );
    audioPlayer.setPlaylist(makePlaylist(beatmaps, osuSongPath), COLLECTION_NAME);
  };

  const handleClick = () => {
    const beatmaps = Object.values(history);
    select({ collection: beatmaps, collectionName: COLLECTION_NAME });
  };

  return (
    <div className={classes.collectionWrapper} onClick={handleClick} style={{ order: -1 }}>
      <CollectionCover artWorks={artWorks} onPlay={handlePlay} isPlaying={isPlaying} />
      <p className={classes.title}>All</p>
      <p className={classes.beatmapCount}>{`${beatmapsCount} beatmaps`}</p>
    </div>
  );
};

export default AllBeatmapsCollection;
