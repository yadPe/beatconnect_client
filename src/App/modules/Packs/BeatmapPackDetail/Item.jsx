import { shell } from 'electron';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles } from 'react-jss';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import reqImgAssets from '../../../helpers/reqImgAssets';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { useCurrentDownloadItem } from '../../../Providers/downloadManager/downloadManager.hook';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import NewButton from '../../common/newButton';
import config from '../../../../shared/config';
import { useDownloadHistory } from '../../../Providers/HistoryProvider';
import { resolveThumbURL } from '../../../../shared/PpyHelpers.bs';
import useBeatmapSong from '../../../Providers/AudioPlayer/useBeatmapSong';
import { getOsuPath } from '../../Settings/reducer/selectors';
import { secToMinSec } from '../../../helpers/timeSince';

const useStyle = createUseStyles({
  listItem: {
    position: 'relative',
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    marginLeft: 'calc(1rem + 8px)',
    width: 'calc(100% - 3rem)',
    borderRadius: '5px',
    paddingRight: '10px',
    backgroundColor: ({ failed }) => (failed ? 'rgba(255, 0,0,.2)' : 'none'),
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
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
    margin: '5px 15px 5px 10px',
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
  titleArtist: {
    display: 'flex',
    flexDirection: 'column',
    flex: '7 0 200px',
  },
  title: {
    display: 'flex',
    fontSize: '15pt',
    alignItems: 'center',
    paddingRight: '10px',
  },
  artist: {
    minWidth: 0,
    flex: '9 1 0',
    display: 'flex',
    alignItems: 'center',
    color: '#aaa',
    fontSize: '13pt',
  },
  duration: { color: '#aaa', fontSize: '13pt', display: 'flex', alignItems: 'center' },
  downloadButton: {
    display: 'flex',
  },
  beatmapPageButton: {
    marginRight: '35px',
    marginLeft: '15px',
    display: 'flex',
  },
  ellipsis: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', margin: 0 },
});

const BeatmapListItem = ({ index, style, data }) => {
  const {
    removeItemfromQueue = () => {},
    items,
    itemMode = 'pack' || 'download' || 'library',
    collectionName,
    discardFailedDownload = () => {},
  } = data;
  const isPackMode = itemMode === 'pack';
  const isDownloadMode = itemMode === 'download';
  const isLibraryMode = itemMode === 'library';
  const item = items[index];
  const { id, title, artist, creator, songDuration, failed } = item;

  const osuPath = useSelector(getOsuPath);
  const [artworkURL, setArtWorkURL] = useState('');
  useEffect(() => {
    resolveThumbURL(id, osuPath).then(setArtWorkURL);
  }, []);

  const history = useDownloadHistory();
  const { push, pauseResumeDownload, currentDownload, cancelDownload } = useDownloadQueue();
  const isDownloaded = history.contains(id);

  const downloadProgress = useCurrentDownloadItem(id);

  const classes = useStyle({
    downloadProgress: downloadProgress === -1 && !isDownloadMode ? 0.5 : downloadProgress,
    failed,
  });

  const { status } = currentDownload || {};
  const isDownloading = downloadProgress >= 0;
  const isPaused = status === config.download.status.paused;

  const { isPlaying, isSelected, playPreview } = useBeatmapSong({ id, title, artist, collectionName }, itemMode, items);

  const handleClick = () => {
    if (isDownloadMode) return;
    if (isPackMode && !isDownloading && !isDownloaded) push(item);
    if (isLibraryMode) playPreview();
  };

  const handleCancel = () => {
    if (isDownloading) cancelDownload();
    else if (failed) discardFailedDownload(items[index].id);
    else removeItemfromQueue(items[index].id);
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
        <NewButton
          iconName="Search"
          onClick={e => {
            e.stopPropagation();
            shell.openExternal(getBeatmapInfosUrl(item));
          }}
          title="See beatmap page"
          borderless
        />
        <div
          className={`${classes.thumbnail} thumbnail`}
          style={{
            backgroundImage: `url(${artworkURL})`,
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
        <div className={classes.titleArtist}>
          <div className={classes.title}>
            <p title={title} className={classes.ellipsis}>
              {title}
            </p>
          </div>
          <div style={{ color: '#aaa', fontSize: '13pt', display: 'flex' }}>
            <p title={artist} className={classes.ellipsis}>
              {artist}
            </p>
          </div>
        </div>
        <div className={classes.artist}>
          <p title={creator} className={classes.ellipsis}>
            {creator}
          </p>
        </div>
        {isLibraryMode && (
          <div className={classes.duration}>
            <p title={secToMinSec(songDuration || 0)} className={classes.ellipsis}>
              {secToMinSec(songDuration || 0)}
            </p>
          </div>
        )}

        {isDownloadMode && isDownloading && (
          <NewButton iconName={isPaused ? 'Download' : 'Pause'} onClick={pauseResumeDownload} borderless />
        )}
        {isDownloadMode && <NewButton iconName="Cancel" onClick={handleCancel} borderless />}
        {isPackMode && (
          <DownloadBeatmapBtn
            beatmapSet={item}
            title="Download"
            noStyle
            className={`${classes.downloadButton} clickable`}
          />
        )}
      </div>
    </div>
  );
};

export default BeatmapListItem;
