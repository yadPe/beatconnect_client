/* eslint-disable no-continue */
import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { trackEvent } from '../../../helpers/tracking';
import { makePlaylist, getAudioFilePath } from '../../../Providers/AudioPlayer/audioPlayer.helpers';
import { useAudioPlayer } from '../../../Providers/AudioPlayer/AudioPlayerProvider.bs';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { getOsuSongPath } from '../../Settings/reducer/selectors';
import CollectionCover from './CollectionCover';

const useStyle = createUseStyles({
  collectionWrapper: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.03)',
    height: '280px',
    width: '200px',
    textAlign: 'left',
    transition: 'background-color .3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.06)',
    },
    '&:hover .playIcon': {
      opacity: 1,
      top: 'calc(50% - 32px)',
    },
    '&:hover .collectionCoverWrapper::after': {
      opacity: 1,
    },
  },
  title: {
    fontSize: '1rem',
    marginBottom: 0,
  },
  beatmapCount: {
    fontSize: '.8rem',
  },
});

const Collection = ({ name, beatmapsHash, select }) => {
  const { containsMD5, ready } = useDownloadHistory();
  const classes = useStyle();
  const osuSongPath = useSelector(getOsuSongPath);
  const audioPlayer = useAudioPlayer();

  const [artWorksIds, setArtWorksIds] = useState([]);

  const getBeatmapsList = useCallback(() => {
    const beatmapList = [];
    for (let i = beatmapsHash.length - 1; i >= 0; i -= 1) {
      const maybeItem = containsMD5(beatmapsHash[i]);
      if (typeof maybeItem === 'undefined') continue;
      if (beatmapList.some(beatmap => beatmap.id === maybeItem.id)) continue;
      beatmapList.push(maybeItem);
    }
    return beatmapList;
  }, [ready, beatmapsHash.length, beatmapsHash[beatmapsHash.length - 1]]);

  const getCoverArtworksIds = useCallback(() => {
    const artWorksIds = [];
    for (let i = beatmapsHash.length - 1; i >= 0; i -= 1) {
      const maybeItem = containsMD5(beatmapsHash[i]);
      if (typeof maybeItem !== 'undefined') {
        if (!artWorksIds.includes(maybeItem.id)) artWorksIds.push(maybeItem.id);
      }
      if ((beatmapsHash.length < 4 && artWorksIds.length >= 1) || artWorksIds.length >= 4) break;
    }
    return artWorksIds;
  }, [ready, beatmapsHash.length, beatmapsHash[beatmapsHash.length - 1]]);

  useEffect(() => {
    setArtWorksIds(() => getCoverArtworksIds());
  }, [ready, beatmapsHash.length, beatmapsHash[beatmapsHash.length - 1]]);

  const isPlaying = audioPlayer.playingState.isPlaying && audioPlayer.playlistID === name;
  const handlePlay = () => {
    if (audioPlayer.playlistID === name) {
      audioPlayer.togglePlayPause();
      return;
    }
    const beatmaps = getBeatmapsList();
    if (!beatmaps.length) return;
    audioPlayer.setAudio(
      { id: beatmaps[0].id, title: beatmaps[0].title, artist: beatmaps[0].artist },

      getAudioFilePath(osuSongPath, beatmaps[0].audioPath) || undefined,
    );
    audioPlayer.setPlaylist(makePlaylist(beatmaps, osuSongPath), name);
    trackEvent('collectionPlay', 'start');
  };

  const handleClick = () => {
    const beatmaps = getBeatmapsList();
    select({ collection: beatmaps, collectionName: name });
  };

  return (
    <div className={classes.collectionWrapper} onClick={handleClick} style={{ order: beatmapsHash.length ? 0 : 1 }}>
      <CollectionCover artWorksIds={artWorksIds} onPlay={handlePlay} isPlaying={isPlaying} />
      <p className={classes.title}>{name}</p>
      <p className={classes.beatmapCount}>{`${beatmapsHash.length} test`}</p>
    </div>
  );
};

export const useCollectionStyle = useStyle;
export default Collection;
