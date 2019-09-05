import React, { useEffect, useState, cloneElement, useContext } from 'react'
import DownloadedItems from './DownloadedItems';
import DownloadsInQueue from './DownloadsInQueue';
import DownloadsInProgress from './DownloadsInProgress';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'

const Downloads = ({ theme, setHeaderContent }) => {
  const DownloadQueue = useContext(DownloadQueueContext);
  const { queue } = DownloadQueue;
  const queueActive = queue.length !== 0;
  const [selected, setSelected] = useState(queueActive ? `Queued ${queueActive ? queue.length : ''}` : 'Downloaded');

  useEffect(() => {
    setHeaderContent(<DownloadsInProgress theme={theme}/>)
    return () => setHeaderContent(null)
  }, [setHeaderContent])

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      theme={theme}
      background={theme.primary}
      selected={selected === title}
      onSelect={() => setSelected(title)}
      padding="10px 20px"
    >
      {setHeader => cloneElement(content, { setHeaderContent: setHeader })}
    </NavPanelItem>
  );

  return (
    <React.Fragment>
      {/* <DownloadsInProgress theme={theme} /> */}
      <div className='menuContainer Downloads' style={{ transition: 'background 0ms' }}>
      <NavPanel
        paneExpandedLength={150}
        defaultIsPanelExpanded
        sidePanelBackground='#1d1d1d'
        theme={theme}
      >
        {renderItem(`Queued ${queueActive ? queue.length : ''}`, <DownloadsInQueue theme={theme} DownloadQueue={DownloadQueue}/>)}
        {renderItem('Downloaded', <DownloadedItems theme={theme} />)}
      </NavPanel>
      </div>
    </React.Fragment>
  );
}

export default Downloads;