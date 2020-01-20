import React, { useEffect, useState, cloneElement } from 'react';
import { useTheme } from 'react-jss';

import DownloadedItems from './components/DownloadedItems';
import DownloadsInQueue from './components/DownloadsInQueue';
import DownloadsInProgress from './components/DownloadsInProgress';
import NavPanelItem from '../common/NavPanel/Item';
import NavPanel from '../common/NavPanel';
import { useDownloadQueue } from '../../Providers/downloadManager';

const Downloads = ({ setHeaderContent }) => {
  const { queue, removeItemfromQueue } = useDownloadQueue();
  const theme = useTheme();
  const queueActive = !!queue.length;
  const [selected, setSelected] = useState(queueActive ? `Queued` : 'Downloaded');

  useEffect(() => {
    setHeaderContent(<DownloadsInProgress />);
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
        {renderItem(`Queued`, <DownloadsInQueue queue={queue} removeItemfromQueue={removeItemfromQueue} />)}
        {renderItem('Downloaded', <DownloadedItems theme={theme} />)}
      </NavPanel>
    </div>
  );
};

export default Downloads;
