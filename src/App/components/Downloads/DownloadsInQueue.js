import React, { useContext } from 'react';
import DownloadsItem from './DownloadsItem';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInQueue = ({ theme }) => {
  const { queue } = useContext(DownloadQueueContext);
  const renderDownloads = () => {
    return (
      <div className='DownloadsInQueue' style={{ marginBottom: 15 }}>
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