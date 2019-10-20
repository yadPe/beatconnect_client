import React, { useState, memo } from 'react';
import getBeatmapInfosUrl from '../../utils/getBeatmapInfosUrl';
import Cover from '../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../common/Beatmap/PreviewBeatmapBtn';
import { Text, Button } from 'react-desktop';
import { shell } from 'electron';
import renderIcons from '../../utils/renderIcons';
import timeSince from '../../utils/timeSince';
import injectSheet from 'react-jss';
import styles from './ItemStyles';

const DownloadsItem = ({ id, name, item, date, theme, status, progress, speed, classes, cancel }) => {
  const [isPaused, setIsPaused] = useState(false);

  const toggleDownload = () => {
    item.isPaused() ? item.resume() : item.pause();
    setIsPaused(item.isPaused());
  };

  return (
    <div className={classes.DownloadsItem}>
      <div className={classes.fade}>
        <Cover url={`https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`} height={130} />
      </div>
      {progress ? (
        <div className={classes.downloadInfos}>
          <div style={{ fontSize: '1.5em' }}>{`${Math.round(progress)}%`}</div>
          <div style={{ fontSize: '0.8.em' }}>{speed}</div>
        </div>
      ) : null}
      <div className={classes.controls}>
        <div className={classes.leftControls}>
          <Text color="#fff">{name}</Text>
          <Text color="#fff">{status === 'downloaded' ? `Downloaded ${timeSince(new Date(date))}` : status}</Text>
          <PreviewBeatmapBtn theme={theme} beatmapSetId={id} />
          <Button
            push
            color={theme.palette.primary.accent}
            onClick={() => shell.openExternal(getBeatmapInfosUrl({ id }))}
            hidden={false}
          >
            {renderIcons('Search', theme.style)}
          </Button>
        </div>
        <div className={classes.rightControls}>
          <Button
            push
            color={theme.palette.primary.accent}
            onClick={toggleDownload}
            hidden={!(status === 'downloading')}
          >
            {renderIcons(isPaused ? 'Download' : 'Pause', theme.style)}
          </Button>
          <Button push color={theme.warning} onClick={cancel} hidden={status === 'downloaded'}>
            {renderIcons('Cancel', theme.style)}
          </Button>
        </div>
      </div>
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (nextProps.progress) {
    return prevProps.progress === nextProps.progress && prevProps.speed === nextProps.speed;
  }
  return prevProps.status === nextProps.status;
};
export default memo(injectSheet(styles)(DownloadsItem), areEqual);
