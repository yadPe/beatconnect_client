import React from 'react';
import DownloadsItem from './Item';

const DownloadsInQueue = ({ theme, DownloadQueue }) => {
  const { queue, removeItemfromQueue } = DownloadQueue;
  
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