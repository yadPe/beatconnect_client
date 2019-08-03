import React, { useContext } from 'react';
import DownloadsItem from './DownloadsItem';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInQueue = ({ theme }) => {
  const { queue } = useContext(DownloadQueueContext);
  const renderDownloads = () => {
    if (queue.length === 0) return null
    return (
      <div className='downloadMenu DownloadsInQueue' style={{ marginBottom: '5vh' }}>
        {
          queue.map(item => {
            const { id } = item;
            return <DownloadsItem id={id} theme={theme} status='queued' key={`queued${id}`} />
          })
        }
      </div >
    )
  }
  return (
    <React.Fragment>
      {renderDownloads()}
    </React.Fragment>
  );
}

export default DownloadsInQueue;