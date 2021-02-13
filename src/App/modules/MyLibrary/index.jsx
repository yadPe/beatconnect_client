import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import config from '../../../shared/config';
import { useDownloadHistory } from '../../Providers/HistoryProvider';
import BeatmapListItem from '../Packs/BeatmapPackDetail/Item';
import Empty from './components/Empty';
import Header from './components/Header';

const MyLibrary = ({ setHeaderContent, windowSize }) => {
  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;

  const [filter, setFilter] = useState('');
  const { history, stats } = useDownloadHistory();
  let historyItems = Object.values(history);
  useEffect(() => {
    setHeaderContent(
      <Header
        setFilter={setFilter}
        unplayedCount={stats.overallUnplayedCount}
        overallDration={stats.overallDuration}
        beatmapSetCount={historyItems.length}
      />,
    );
    return () => setHeaderContent(null);
  });

  if (filter) {
    const lowerCase = filter.toLowerCase();
    historyItems = historyItems.filter(historyItem =>
      [historyItem.id, historyItem.title, historyItem.artist, historyItem.creator].some(
        property =>
          property &&
          String(property)
            .toLowerCase()
            .includes(lowerCase),
      ),
    );
  }

  const itemCount = historyItems.length;
  return (
    <div className="menuContainer Downloads" style={{ transition: 'background 0ms', overflow: 'hidden' }}>
      {itemCount ? (
        <List
          height={listHeight}
          itemCount={itemCount}
          itemSize={50}
          width={listWidth}
          itemData={{ items: historyItems, itemMode: 'library' }}
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
export default connect(mapStateToProps)(MyLibrary);
