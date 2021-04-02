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

const AllBeatmapsCollection = () => {
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

  const handlePlay = () => {
    const beatmaps = Object.values(history);
    if (!beatmaps.length) return;
    audioPlayer.setAudio(
      { id: beatmaps[0].id, title: beatmaps[0].title, artist: beatmaps[0].artist },
      () => {},
      getAudioFilePath(osuSongPath, beatmaps[0].audioPath) || undefined,
    );
    audioPlayer.setPlaylist(makePlaylist(beatmaps, osuSongPath));
  };

  return (
    <div className={classes.collectionWrapper}>
      <CollectionCover artWorks={artWorks} onPlay={handlePlay} />
      <p className={classes.title}>All</p>
      <p className={classes.beatmapCount}>{`${beatmapsCount} beatmaps`}</p>
    </div>
  );
};

export default AllBeatmapsCollection;
