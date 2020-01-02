import React, { useEffect, useState, cloneElement, useContext } from 'react';
import { useTheme } from 'react-jss';
import DownloadedItems from './DownloadedItems';
import DownloadsInQueue from './DownloadsInQueue';
import DownloadsInProgress from './DownloadsInProgress';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider';

const Downloads = ({ setHeaderContent }) => {
  const DownloadQueue = useContext(DownloadQueueContext);
  const theme = useTheme();
  const { queue } = DownloadQueue;
  const queueActive = queue.length !== 0;
  const [selected, setSelected] = useState(queueActive ? `Queued` : 'Downloaded');

  useEffect(() => {
    setHeaderContent(<DownloadsInProgress theme={theme} />);
    return () => setHeaderContent(null);
  }, [setHeaderContent, theme]);

  const renderItem = (title, content) => (
    <NavPanelItem
      title={title}
      background={theme.palette.primary.dark}
      selected={selected === title}
      onSelect={() => setSelected(title)}
      padding="10px 20px"
    >
      {setHeader => cloneElement(content, { setHeaderContent: setHeader })}
    </NavPanelItem>
  );

  return (
    <div className="menuContainer Downloads" style={{ transition: 'background 0ms' }}>
      <NavPanel paneExpandedLength={150} defaultIsPanelExpanded sidePanelBackground={theme.palette.secondary.dark}>
        {renderItem(`Queued`, <DownloadsInQueue theme={theme} DownloadQueue={DownloadQueue} />)}
        {renderItem('Downloaded', <DownloadedItems theme={theme} />)}
      </NavPanel>
    </div>
  );
};

export default Downloads;
