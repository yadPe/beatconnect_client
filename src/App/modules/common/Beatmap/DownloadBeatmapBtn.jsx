import React, { useContext, useEffect } from 'react';
import  ProgressCircle  from '../ProgressCircle';
import InjectSheet, { useTheme } from 'react-jss';
import Button from '../Button';
import renderIcons from '../../../helpers/renderIcons';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { make as ProgressRing } from '../ProgressRing.bs';
import { useDownloadQueue } from '../../../Providers/downloadManager';

const styles = {
  wrapper: {
    '& > svg': {
      display: 'block',
      margin: '5px auto',
    },
  },
};

const DownloadBeatmapBtn = ({ classes, beatmapSet, autoDl, noStyle, pack, className, ...otherProps }) => {
  const theme = useTheme();
  const history = useContext(HistoryContext);
  const { push, queue, currentDownload, pushMany } = useDownloadQueue();

  const isInQueue = pack
    ? queue.some(queueItem => pack.some(beatmap => beatmap.id === queueItem.beatmapSetId))
    : queue.some(queueItem => queueItem.beatmapSetId === beatmapSet.id);
  const isDownloading = !pack && currentDownload && currentDownload.beatmapSetId === beatmapSet.id;

  const alreadydownloaded = pack
    ? pack.filter(map => history.contains(map.id)).length === pack.length
    : history.contains(beatmapSet.id);

  const downloadBeatmap = e => {
    if (e) e.stopPropagation();
    if (pack) {
      const beatmapsToDownload = pack.filter(beatmap => !history.contains(beatmap.id));
      pushMany(beatmapsToDownload);
    } else {
      push(beatmapSet);
    }
  };

  useEffect(() => {
    if (autoDl) downloadBeatmap();
  }, [autoDl]);

  const renderContent = () => {
    if (!noStyle && isDownloading && currentDownload.progressPercent)
      return <ProgressRing radius={13.5} stroke={2} progress={currentDownload.progressPercent} />;
    if (isDownloading || isInQueue) return <ProgressCircle />;
    return alreadydownloaded ? renderIcons({ name: 'Checked' }) : renderIcons({ name: 'Download' });
  };

  if (noStyle) {
    return (
      <div onClick={downloadBeatmap} role="button" {...otherProps} className={`${classes.wrapper} ${className}`}>
        {renderContent()}
      </div>
    );
  }

  return (
    <Button color={theme.palette.primary.accent} onClick={downloadBeatmap}>
      {renderContent()}
    </Button>
  );
};

export default InjectSheet(styles)(DownloadBeatmapBtn);
