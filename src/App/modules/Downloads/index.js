import React, { useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { connect } from 'react-redux';
import { useDownloadQueue } from '../../Providers/downloadManager';
import config from '../../../shared/config';
import BeatmapListItem from '../Packs/BeatmapPackDetail/Item';
import Header from './components/Header';
import Empty from './components/Empty';

const Downloads = ({ setHeaderContent, windowSize }) => {
  const { removeItemfromQueue, beatmapSetsInQueue } = useDownloadQueue();

  useEffect(() => {
    setHeaderContent(<Header />);
    return () => setHeaderContent(null);
  }, []);

  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;
  return (
    <div className="menuContainer Downloads" style={{ transition: 'background 0ms', overflow: 'hidden' }}>
      {beatmapSetsInQueue.length ? (
        <List
          height={listHeight}
          itemCount={beatmapSetsInQueue.length}
          itemSize={50}
          width={listWidth}
          itemData={{ items: beatmapSetsInQueue, downloadSection: true, removeItemfromQueue }}
        >
          {BeatmapListItem}
        </List>
      ) : (
        <Empty />
      )}
    </div>
  );
};

const mapStateToProps = ({ app }) => ({
  windowSize: app.window,
});
export default connect(mapStateToProps)(Downloads);
