import React, { useContext } from 'react'
import DownloadedItems from './DownloadedItems';
import DownloadsInQueue from './DownloadsInQueue';
import DownloadsInProgress from './DownloadsInProgress';

const Downloads = ({ theme }) => {
  return (
    <div className='menuContainer Downloads' style={{ transition: 'background 0ms' }}>
      <DownloadsInProgress theme={theme} />
      <div className='separator' />
      <DownloadsInQueue theme={theme} />
      <div className='separator' />
      <DownloadedItems theme={theme} />
    </div>
  );
}

export default Downloads;