import React, { useContext } from 'react'
import DownloadsItem from './Item';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInProgress = ({ theme }) => {
  const { cancelDownload, currentDownload } = useContext(DownloadQueueContext);
  const renderDownloads = () => {
    const { infos, progress, item } = currentDownload;
    if (!infos) return null;
    return (
      <div className='downloadMenu DownloadsInProgress' style={{ marginBottom: '3vh' }}>
        <DownloadsItem id={infos.id} item={item} name={infos.fullTitle} {...progress} theme={theme} cancel={cancelDownload} status='downloading' key={infos.id} />
      </div>
    )
  }
  return (
    <React.Fragment>
      {renderDownloads()}
    </React.Fragment>
  );
}

export default DownloadsInProgress;