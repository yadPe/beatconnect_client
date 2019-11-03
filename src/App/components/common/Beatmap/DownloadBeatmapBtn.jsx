import React, { useContext, useEffect } from 'react';
import { ProgressCircle } from 'react-desktop/windows';
import { useTheme } from 'theming';
import InjectSheet from 'react-jss';
import Button from '../Button';
import renderIcons from '../../../utils/renderIcons';
import { DownloadQueueContext } from '../../../../Providers/DownloadQueueProvider';
import { HistoryContext } from '../../../../Providers/HistoryProvider';
import ProgressRing from '../ProgressRing';

const styles = {
  wrapper: {
    '& > svg': {
      display: 'block',
      margin: 'auto',
    },
  },
};

const DownloadBeatmapBtn = ({ classes, url, infos, autoDl, noStyle, pack, className, ...otherProps }) => {
  const theme = useTheme();
  const history = useContext(HistoryContext);
  const { currentDownload, push, queue, pushMany } = useContext(DownloadQueueContext);

  const downloaded = pack
    ? pack.filter(map => history.contains(map.id)).length === pack.length
    : history.contains(infos.id);
  let isInQueue = false;
  let fullTitle = '';
  let isDownloading = false;
  if (pack) {
    isInQueue = queue.filter(item => pack.find(beatmap => beatmap.id === item.id)).length;
  } else {
    const { title, artist, creator, id } = infos;
    fullTitle = `${title} - ${artist} ${creator && `| ${creator}`}`;
    isInQueue = queue.filter(item => item.id === id).length;
    isDownloading = currentDownload.infos && currentDownload.infos.id === id;
  }

  const downloadBeatmap = e => {
    e.stopPropagation();
    if (pack) {
      const beatmapsToDownload = pack.filter(beatmap => !history.contains(beatmap.id));
      pushMany(
        beatmapsToDownload.map(({ unique_id, id, title, artist }) => ({
          url: `https://beatconnect.io/b/${id}/${unique_id}`,
          id,
          fullTitle: `${title} - ${artist}`,
          onFinished: () => history.save({ id, name: `${title} - ${artist}` }),
        })),
      );
    } else {
      push({
        url,
        id: infos.id,
        fullTitle,
        onFinished: () => {
          history.save({ id: infos.id, name: fullTitle });
        },
      });
    }
  };

  useEffect(() => {
    if (autoDl) downloadBeatmap();
  }, [autoDl]);

  const renderContent = () => {
    if (isDownloading && currentDownload.progress)
      return <ProgressRing radius={20} stroke={2} progress={currentDownload.progress.progress} />;
    if (isDownloading || isInQueue) return <ProgressCircle className="ProgressCircle" color="#fff" size={28} />;
    return downloaded ? renderIcons('Checked', theme.style) : renderIcons('Download', theme.style);
  };

  if (noStyle) {
    return (
      <div onClick={downloadBeatmap} role="button" {...otherProps} className={`${classes.wrapper} ${className}`}>
        {renderContent()}
      </div>
    );
  }

  return (
    <Button push color={theme.palette.primary.accent} onClick={downloadBeatmap}>
      {renderContent()}
    </Button>
  );
};

export default InjectSheet(styles)(DownloadBeatmapBtn);
