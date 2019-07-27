import React, { useContext } from 'react'
import DownloadsItem from './DownloadsItem';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInProgress = ({ theme }) => {
  const { currentDownload } = useContext(DownloadQueueContext);
  const renderDownloads = () => {
    const { infos, item, progress } = currentDownload;
    if (!infos) return null;
    return <DownloadsItem id={infos.id} progress={progress} theme={theme} status='downloading'/>
  }
  return (
    <React.Fragment>
      {renderDownloads()}
    </React.Fragment>
  );
}

export default DownloadsInProgress;