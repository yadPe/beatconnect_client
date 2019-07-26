import React, { useContext } from 'react'
import DownloadedItems from './DownloadedItems';

const Downloads = ({ theme }) => {
  return (
    <div className='menuContainer Downloads' style={{ transition: 'background 0ms' }}>
      <DownloadedItems theme={theme} />
    </div>
  );
}

export default Downloads;