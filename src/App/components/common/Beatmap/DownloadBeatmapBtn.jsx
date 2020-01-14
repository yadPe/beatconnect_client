import React, { useContext, useEffect } from 'react';
import { ProgressCircle } from 'react-desktop/windows';
import InjectSheet, { useTheme } from 'react-jss';
import Button from '../Button';
import renderIcons from '../../../utils/renderIcons';
import { DownloadQueueContext } from '../../../../Providers/DownloadQueueProvider';
import { HistoryContext } from '../../../../Providers/HistoryProvider';
import { make as ProgressRing } from '../ProgressRing.bs';
import { useDownloadQueue } from '../../../../Providers/downloadManager';

const styles = {
  wrapper: {
    '& > svg': {
      display: 'block',
      margin: '5px auto',
    },
  },
};

const DownloadBeatmapBtn = ({ classes, url, infos, autoDl, noStyle, pack, className, ...otherProps }) => {
  const theme = useTheme();
  const history = useContext(HistoryContext);
  const { currentDownload, queue, pushMany } = useContext(DownloadQueueContext);
  const { push } = useDownloadQueue();
  // console.log('con', cont);

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
        // eslint-disable-next-line camelcase
        beatmapsToDownload.map(({ unique_id, id, title, artist }) => ({
          url: `https://beatconnect.io/b/${id}/${unique_id}`,
          id,
          fullTitle: `${title} - ${artist}`,
          onFinished: () => history.save({ id, name: `${title} - ${artist}` }),
        })),
      );
    } else {
      push({
        beatmapSetId: infos.id,
        uniqId: infos.unique_id,
        beatmapSetInfos: { fullTitle },
        // onFinished: () => {
        //   history.save({ id: infos.id, name: fullTitle });
        // },
      });
    }
  };

  useEffect(() => {
    if (autoDl) downloadBeatmap();
  }, [autoDl]);

  const renderContent = () => {
    if (isDownloading && currentDownload.progress)
      return <ProgressRing radius={13.5} stroke={2} progress={currentDownload.progress.progress} />;
    if (isDownloading || isInQueue) return <ProgressCircle className="ProgressCircle" color="#fff" size={17} />;
    return downloaded ? renderIcons({ name: 'Checked' }) : renderIcons({ name: 'Download' });
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
