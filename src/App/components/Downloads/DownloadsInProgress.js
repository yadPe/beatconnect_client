import React, { useContext } from 'react'
import DownloadsItem from './DownloadsItem';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInProgress = ({ theme }) => {
  const { currentDownload } = useContext(DownloadQueueContext);
  const renderDownloads = () => {
    const { infos, item, progress } = currentDownload;
    if (!infos) return null;
    return (
      <div className='downloadMenu DownloadsInProgress' style={{ marginBottom: '3vh' }}>
        <DownloadsItem id={infos.id} progress={progress} theme={theme} status='downloading' key={`download${infos.id}`} />
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