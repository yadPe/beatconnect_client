import React from 'react';
import injectSheet, { useTheme } from 'react-jss';
import renderIcons from '../../utils/renderIcons';
import Button from '../common/Button';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import config from '../../../config';

const styles = {
  DownloadsInProgress: {
    display: 'inline-flex',
    width: '100%',
    '& p:last-of-type': {
      margin: 'auto 5px',
    },
    '& p:first-of-type': {
      marginRight: 'auto',
    },
  },
};

const DownloadsInProgress = ({ classes }) => {
  const theme = useTheme();
  const { cancelDownload, currentDownload, clear, queue, pauseResumeDownload } = useDownloadQueue();
  const { beatmapSetId, progressPercent, downloadSpeed, status } = currentDownload || {};
  const [currentQueueItem] = queue;

  const isPaused = status === config.download.status.paused;
  const renderDownloads = () => {
    if (!beatmapSetId) return null;
    return (
      <div className={classes.DownloadsInProgress}>
        <p>{currentQueueItem.beatmapSetInfos.fullTitle}</p>
        {progressPercent ? (
          <>
            <p>{`${Math.round(progressPercent)}% @`}</p>
            <p>{downloadSpeed}</p>
          </>
        ) : null}

        <Button push color={theme.palette.primary.accent} onClick={pauseResumeDownload}>
          {renderIcons({ name: isPaused ? 'Download' : 'Pause', style: theme.accentContrast })}
        </Button>
        <Button push color={theme.warning} onClick={cancelDownload}>
          {renderIcons({ name: 'Cancel', style: theme.accentContrast })}
        </Button>
        {queue.length > 1 && (
          <Button push color={theme.warning} onClick={clear}>
            {renderIcons({ name: 'CancelAll', style: theme.accentContrast })}
          </Button>
        )}
      </div>
    );
  };
  return <>{renderDownloads()}</>;
};

export default injectSheet(styles)(DownloadsInProgress);
