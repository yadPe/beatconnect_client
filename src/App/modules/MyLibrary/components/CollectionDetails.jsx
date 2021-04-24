import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import config from '../../../../shared/config';
import BeatmapListItem from '../../Packs/BeatmapPackDetail/Item';
import Empty from './Empty';
import Header from './Header';
import { COLLECTION_NAME as AllBeatmapsCollectionName } from './AllBeatmaps';
import { getActiveSectionParams } from '../../../app.selectors';
import { useAudioPlayer } from '../../../Providers/AudioPlayer/AudioPlayerProvider.bs';
import { getAudioFilePath } from '../../../Providers/AudioPlayer/audioPlayer.helpers';
import { getOsuSongPath } from '../../Settings/reducer/selectors';
import { clearSectionParams } from '../../../app.actions';

const CollectionDetails = ({ windowSize, collection, select, collectionName, deepLink, osuSongPath }) => {
  const dispatch = useDispatch();
  const audioPlayer = useAudioPlayer();

  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;
  const listItemSize = 50;

  const deepLinkedItemIndex =
    deepLink.beatmapsetId && collection.findIndex(item => item.id === parseInt(deepLink.beatmapsetId, 10));
  const scrollOffset =
    deepLinkedItemIndex !== undefined && deepLinkedItemIndex !== -1 ? deepLinkedItemIndex * listItemSize : 0;
  useEffect(() => {
    if (deepLinkedItemIndex !== undefined && deepLinkedItemIndex !== -1) {
      const { id, title, artist, audioPath } = collection[deepLinkedItemIndex];
      audioPlayer.setAudio({ id, title, artist }, getAudioFilePath(osuSongPath, audioPath));
      dispatch(clearSectionParams());
    }
  }, [deepLinkedItemIndex]);

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
          itemSize={listItemSize}
          width={listWidth}
          initialScrollOffset={scrollOffset}
          itemData={{ items: displayedItems, itemMode: 'library', collectionName }}
        >
          {BeatmapListItem}
        </List>
      ) : (
        <Empty isCollection={collectionName !== AllBeatmapsCollectionName} />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  windowSize: state.app.window,
  deepLink: getActiveSectionParams(state),
  osuSongPath: getOsuSongPath(state),
});
export default connect(mapStateToProps)(CollectionDetails);
