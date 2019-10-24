import React, { useContext, useEffect } from 'react';
import renderIcons from '../../../utils/renderIcons';
import { ProgressCircle, Button } from 'react-desktop/windows';
import { DownloadQueueContext } from '../../../../Providers/DownloadQueueProvider';
import { HistoryContext } from '../../../../Providers/HistoryProvider';
import { useTheme } from 'theming';

const DownloadBeatmapBtn = ({ url, infos, autoDl, noStyle, ...otherProps }) => {
  const theme = useTheme();
  const { title, artist, creator, id } = infos;
  const fullTitle = `${title} - ${artist} ${creator && `| ${creator}`}`;
  const history = useContext(HistoryContext);
  const { currentDownload, push, queue } = useContext(DownloadQueueContext);
  const downloaded = history.contains(id);
  let isDownloading = false;
  isDownloading =
    queue.filter(item => item.id === id).length > 0
      ? true
      : false || currentDownload.infos
      ? currentDownload.infos.id === id
      : false;

  const downloadBeatmap = () => {
    push({
      url,
      id,
      fullTitle,
      onFinished: () => {
        history.save({ id, name: fullTitle });
      },
    });
  };

  useEffect(() => {
    if (autoDl) downloadBeatmap();
  }, [autoDl]);

  if (noStyle) {
    return (
      <div onClick={downloadBeatmap} {...otherProps}>
        {isDownloading ? (
          <div>
            <ProgressCircle className="ProgressCircle" color="#fff" size={28} />
          </div>
        ) : downloaded ? (
          renderIcons('Checked', theme.style)
        ) : (
          renderIcons('Download', theme.style)
        )}
      </div>
    );
  }

  return (
    <Button push color={theme.palette.primary.accent} onClick={downloadBeatmap}>
      {isDownloading ? (
        <div>
          <ProgressCircle className="ProgressCircle" color="#fff" size={28} />
        </div>
      ) : downloaded ? (
        renderIcons('Checked', theme.style)
      ) : (
        renderIcons('Download', theme.style)
      )}
    </Button>
  );
};

export default DownloadBeatmapBtn;
