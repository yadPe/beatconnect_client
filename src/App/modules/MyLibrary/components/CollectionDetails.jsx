import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import config from '../../../../shared/config';
import BeatmapListItem from '../../Packs/BeatmapPackDetail/Item';
import Empty from './Empty';
import Header from './Header';

const CollectionDetails = ({ windowSize, collection, select, collectionName }) => {
  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;

  const [filter, setFilter] = useState('');
  useEffect(() => {
    select({
      header: (
        <Header setFilter={setFilter} quit={() => select({ collection: null })} collectionName={collectionName} />
      ),
    });
  }, [collectionName]);

  let displayedItems = collection;
  if (filter) {
    const lowerCase = filter.toLowerCase();
    displayedItems = displayedItems.filter(item =>
      [item.id, item.title, item.artist, item.creator].some(
        property =>
          property &&
          String(property)
            .toLowerCase()
            .includes(lowerCase),
      ),
    );
  }

  const itemCount = displayedItems.length;
  return (
    <div className="menuContainer Downloads" style={{ transition: 'background 0ms', overflow: 'hidden' }}>
      {itemCount ? (
        <List
          height={listHeight}
          itemCount={itemCount}
          itemSize={50}
          width={listWidth}
          itemData={{ items: displayedItems, itemMode: 'library', collectionName }}
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
export default connect(mapStateToProps)(CollectionDetails);
