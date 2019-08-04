import React, { useContext, useCallback } from 'react';
import DownloadsItem from './Item';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const DownloadsInQueue = ({ theme }) => {
  const { queue, removeItemfromQueue } = useContext(DownloadQueueContext);
  
  const renderDownloads = () => {
    if (queue.length === 0) return null
    return (
      <div className='downloadMenu DownloadsInQueue' style={{ marginBottom: '5vh' }}>
        {
          queue.map(item => {
            const { id, fullTitle } = item;
            const unQueue = () => removeItemfromQueue(id)
            return <DownloadsItem id={id} name={fullTitle} theme={theme} cancel={unQueue} status='queued' key={id} />
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