import React from 'react'
import DownloadedItems from './DownloadedItems';
import DownloadsInQueue from './DownloadsInQueue';
import DownloadsInProgress from './DownloadsInProgress';

const Downloads = ({ theme }) => {
  return (
    <React.Fragment>
      <DownloadsInProgress theme={theme} />
      <div className='menuContainer Downloads' style={{ transition: 'background 0ms' }}>
        <DownloadsInQueue theme={theme} />
        <DownloadedItems theme={theme} />
      </div>
    </React.Fragment>
  );
}

export default Downloads;