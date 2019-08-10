import React, { useContext } from 'react';
import renderIcons from '../../../utils/renderIcons'
import { ProgressCircle, Button } from 'react-desktop/windows';
import { DownloadQueueContext } from '../../../../Providers/DownloadQueueProvider'
import { HistoryContext } from '../../../../Providers/HistoryProvider';

const DownloadBeatmapBtn = ({ theme, url, infos }) => {
  const { title, artist, creator, id } = infos;
  const fullTitle = `${title} - ${artist} | ${creator}`
  const history = useContext(HistoryContext);
  const { currentDownload, push, queue } = useContext(DownloadQueueContext);
  const downloaded = history.contains(id)
  let isDownloading = false;
  if (currentDownload.infos) {
    isDownloading = (currentDownload.infos.id === id ||
      queue.filter(item => item.id === id).length > 0 ? true : false)
  }

  const downloadBeatmap = () => {
    push({
      url, id, fullTitle, onFinished: () => {
        history.save({ id, name: fullTitle })
      }
    })
  }

  return (
    <Button
      push
      color={theme.color}
      onClick={downloadBeatmap}>
      {
        isDownloading ?
          <div>
            <ProgressCircle
              className='ProgressCircle'
              color='#fff'
              size={28}
            />
          </div> :
          downloaded ? renderIcons('Checked', theme.style) : renderIcons('Download', theme.style)
      }
    </Button>
  );
}

export default DownloadBeatmapBtn;