import { shell } from 'electron';
import React from 'react';
import { createUseStyles } from 'react-jss';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import reqImgAssets from '../../../helpers/reqImgAssets';
import { useAudioPlayer } from '../../../Providers/AudioPlayerProvider.bs';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { useCurrentDownloadItem } from '../../../Providers/downloadManager/downloadManager.hook';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import NewButton from '../../common/newButton';
import config from '../../../../shared/config';

const getThumbUrl = beatmapId => `https://b.ppy.sh/thumb/${beatmapId}.jpg`;

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
    width: '50px',
    height: '40px',
    margin: '5px 15px 5px 35px',
    position: 'relative',
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

const BeatmapListItem = ({ index, style, data }) => {
  const { removeItemfromQueue = () => {}, downloadSection = false, items } = data;
  const item = items[index];
  const audioPlayer = useAudioPlayer();
  const playPreview = (beatmapSetId, isPlaying, songTitle) =>
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId, () => {}, songTitle);

  const { id, title, artist } = item;

  const downloadProgress = useCurrentDownloadItem(id);
  const classes = useStyle({ downloadProgress: downloadProgress === -1 && !downloadSection ? 0.5 : downloadProgress });

  const isSelected = audioPlayer.playingState.beatmapSetId === id;
  const isPlaying = audioPlayer.playingState.isPlaying && isSelected;

  const { push, pauseResumeDownload, currentDownload, cancelDownload } = useDownloadQueue();
  const { status } = currentDownload || {};
  const isDownloading = downloadProgress >= 0;
  const isPaused = status === config.download.status.paused;
  const handleClick = () => {
    if (downloadSection) return;
    push(item);
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
        <div className={`${classes.thumbnail} thumbnail`} style={{ backgroundImage: `url(${getThumbUrl(id)})` }}>
          <div
            className="playIco clickable"
            style={playIcoStyle}
            onClick={e => {
              e.stopPropagation();
              playPreview(id, isPlaying, `${title} - ${artist}`);
            }}
          />
        </div>
        <div className={classes.title}>{title}</div>
        <div className={classes.artist}>{artist}</div>
        {downloadSection && isDownloading && (
          <NewButton iconName={isPaused ? 'Download' : 'Pause'} onClick={pauseResumeDownload} borderless />
        )}
        {downloadSection && (
          <NewButton
            iconName="Cancel"
            onClick={() => (isDownloading ? cancelDownload() : removeItemfromQueue(items[index].id))}
            borderless
          />
        )}
        {!downloadSection && (
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

export default BeatmapListItem;
