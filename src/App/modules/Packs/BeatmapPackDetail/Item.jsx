import { shell } from 'electron';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import reqImgAssets from '../../../helpers/reqImgAssets';
import { useAudioPlayer } from '../../../Providers/AudioPlayerProvider.bs';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { useCurrentDownloadItem } from '../../../Providers/downloadManager/downloadManager.hook';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import NewButton from '../../common/newButton';
import config from '../../../../shared/config';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { getOsuSongPath } from '../../Settings/reducer/selectors';
import { getAudioFilePath } from './item.utils';
import { getListCoverUrl, getThumbUrl } from '../../../../shared/PpyHelpers.bs';

const useStyle = createUseStyles({
  listItem: {
    position: 'relative',
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0px 24px 1px -24px rgba(255, 255, 255, .3)',
    '&::before': {
      content: "''",
      position: 'absolute',
      width: ({ downloadProgress }) => `${downloadProgress}%`,
      height: '100%',
      zIndex: '-1',
      background:
        'linear-gradient(90deg, rgba(255, 255, 255, 0.11) 91%, rgba(255, 255, 255, 0.15) 100%, rgba(255, 255, 255, 0) 100%)',
      transition: 'all 0.5s',
    },
    '&:hover .playIco': {
      opacity: 0.9,
    },
    '& .clickable': {
      cursor: 'pointer',
    },
  },
  thumbnail: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '50px',
    height: '40px',
    margin: '5px 15px 5px 35px',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& .playIco': {
      position: 'absolute',
      content: '',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '20px',
    },
  },
  title: {
    display: 'flex',
    flex: '6 1 0',
    justifyContent: 'space-between',
    overflow: 'hidden',
    fontSize: '15pt',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: '10px',
  },
  artist: {
    flex: '9 1 0',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    color: '#aaa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '13pt',
  },
  downloadButton: {
    display: 'flex',
  },
  beatmapPageButton: {
    marginRight: '35px',
    marginLeft: '15px',
    display: 'flex',
  },
});

const BeatmapListItem = ({ index, style, data, osuSongPath }) => {
  const { removeItemfromQueue = () => {}, items, itemMode = 'pack' || 'download' || 'library' } = data;
  const isPackMode = itemMode === 'pack';
  const isDownloadMode = itemMode === 'download';
  const isLibraryMode = itemMode === 'library';
  const item = items[index];
  const { id, title, artist } = item;

  const history = useDownloadHistory();
  const audioPlayer = useAudioPlayer();
  const { push, pauseResumeDownload, currentDownload, cancelDownload } = useDownloadQueue();
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
      audioPlayer.setAudio({ id, title, artist }, () => {}, audioPath || undefined);
      audioPlayer.setPlaylist(
        items.map(({ id: mapId, title: mapTitle, artist: mapArtist }) => ({
          id: mapId,
          title: mapTitle,
          artist: mapArtist,
          path: getAudioFilePath(osuSongPath, history.history[mapId].audioPath),
        })),
      );
    } else audioPlayer.setAudio({ id, title, artist }, () => {}, audioPath || undefined, previewTime || undefined);
  };

  const downloadProgress = useCurrentDownloadItem(id);

  const classes = useStyle({ downloadProgress: downloadProgress === -1 && !isDownloadMode ? 0.5 : downloadProgress });

  const { status } = currentDownload || {};
  const isDownloading = downloadProgress >= 0;
  const isPaused = status === config.download.status.paused;
  const handleClick = () => {
    if (isDownloadMode) return;
    if (isPackMode && !isDownloading && !isDownloaded) push(item);
    if (isLibraryMode) playPreview();
  };

  const wrapperStyle = {
    backgroundColor: isSelected && 'rgba(255,255,255,.05)',
  };
  const playIcoStyle = {
    opacity: isPlaying && 0.9,
    backgroundImage: `url(${reqImgAssets(isPlaying ? './pause-button.png' : './play-button.png')})`,
  };

  return (
    <div style={{ ...style, top: `${parseFloat(style.top) + 50}px` }} key={id} onClick={handleClick}>
      <div className={classes.listItem} style={wrapperStyle}>
        <div
          className={`${classes.thumbnail} thumbnail`}
          style={{
            backgroundImage: `url(${getListCoverUrl(id)}), url(${getThumbUrl(id)})`,
          }}
        >
          <div
            className="playIco clickable"
            style={playIcoStyle}
            onClick={e => {
              e.stopPropagation();
              playPreview();
            }}
          />
        </div>
        <div className={classes.title}>{title}</div>
        <div className={classes.artist}>{artist}</div>
        {isDownloadMode && isDownloading && (
          <NewButton iconName={isPaused ? 'Download' : 'Pause'} onClick={pauseResumeDownload} borderless />
        )}
        {isDownloadMode && (
          <NewButton
            iconName="Cancel"
            onClick={() => (isDownloading ? cancelDownload() : removeItemfromQueue(items[index].id))}
            borderless
          />
        )}
        {isPackMode && (
          <DownloadBeatmapBtn
            beatmapSet={item}
            title="Download"
            noStyle
            className={`${classes.downloadButton} clickable`}
          />
        )}
        <NewButton
          iconName="Search"
          onClick={e => {
            e.stopPropagation();
            shell.openExternal(getBeatmapInfosUrl(item));
          }}
          title="See beatmap page"
          borderless
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  osuSongPath: getOsuSongPath(state),
});
export default connect(mapStateToProps)(BeatmapListItem);
