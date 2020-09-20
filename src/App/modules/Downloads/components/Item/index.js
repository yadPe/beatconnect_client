import React, { useState } from 'react';
import injectSheet, { useTheme } from 'react-jss';
import { Text } from 'react-desktop';
import { shell } from 'electron';
import renderIcons from '../../../../helpers/renderIcons';
import timeSince from '../../../../helpers/timeSince';
import getBeatmapInfosUrl from '../../../../helpers/getBeatmapInfosUrl';
import Cover from '../../../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../../../common/Beatmap/PreviewBeatmapBtn';
import styles from './ItemStyles';
import Button from '../../../common/Button';

const DownloadsItem = ({ id, name, item, date, status, progress, speed, classes, cancel, isScrolling }) => {
  const [isPaused, setIsPaused] = useState(false);
  const theme = useTheme();

  const toggleDownload = () => {
    if (item.isPaused()) item.resume();
    else item.pause();
    setIsPaused(item.isPaused());
  };

  return (
    <div className={classes.DownloadsItem}>
      <div className={classes.fade}>
        <Cover url={`https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`} height={130} canLoad={!isScrolling} />
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
          <PreviewBeatmapBtn theme={theme} beatmapSetId={id} songTitle={name} />
          <Button
            color={theme.palette.primary.accent}
            onClick={() => shell.openExternal(getBeatmapInfosUrl({ id }))}
            hidden={false}
          >
            {renderIcons({ name: 'Search', style: theme.accentContrast })}
          </Button>
        </div>
        <div className={classes.rightControls}>
          <Button color={theme.palette.primary.accent} onClick={toggleDownload} hidden={!(status === 'downloading')}>
            {renderIcons({ name: isPaused ? 'Download' : 'Pause', style: theme.accentContrast })}
          </Button>
          <Button color={theme.warning} onClick={cancel} hidden={status === 'downloaded'}>
            {renderIcons({ name: 'Cancel', style: theme.accentContrast })}
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
export default injectSheet(styles)(DownloadsItem);
