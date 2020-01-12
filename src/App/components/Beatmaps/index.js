/* eslint-disable camelcase */
import React, { useEffect, useContext, useState, useRef } from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet, { useTheme } from 'react-jss';
import Beatmap from '../common/Beatmap';
import Search from './components/Search';
import askBeatconnect from './helpers/askBeatconnect';
import store from '../../../store';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import BeatmapSkeleton from '../common/Beatmap/beatmap.skeleton';
import config from '../../../config';
import { saveLastScrollPosition } from './reducer/actions';

const styles = {
  Beatmaps: {
    outline: 'none',
  },
};

const Beatmaps = ({ searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const theme = useTheme();
  const gridContainer = useRef(null);
  const [autoDl, setAutoDl] = useState(false);
  const history = useContext(HistoryContext);
  const { search, lastScroll, hideDownloaded, lastPage } = searchResults;
  const lastSearch = useRef(search);
  let { beatmaps, page } = searchResults;
  if (hideDownloaded) beatmaps = beatmaps.filter(({ beatmapset_id, id }) => !history.contains(id || beatmapset_id));
  const lastScrollPosition = useRef(lastScroll || 0);
  if (typeof lastScroll === 'number' && !_.isEqual(search, lastSearch.current)) {
    lastScrollPosition.current = lastScroll;
    lastSearch.current = search;
    if (gridContainer.current) gridContainer.current.childNodes[0].scrollTop = lastScrollPosition.current;
  }
  const gridWidth =
    window.width - (panelExpended ? config.display.sidePanelExpandedLength : config.display.sidePanelCompactedLength);
  const gridHeight = window.height - (config.display.titleBarHeight + config.display.topBarHeight);
  const displayGrid = gridWidth >= 1200;
  const rowCount = displayGrid ? Math.ceil(beatmaps.length / 2) : beatmaps.length;
  const canLoadMore = hideDownloaded ? !lastPage : beatmaps.length % 50 === 0;
  const onScroll = ({ scrollTop }) => {
    lastScrollPosition.current = scrollTop;
  };
  const loadMore = () => {
    if (!store.getState().beatmaps.fetchingBeatmaps.isFetching) askBeatconnect({ ...search, page: (page += 1) });
  };
  if (beatmaps.length < 50 && hideDownloaded && canLoadMore) loadMore();
  const newItemsRendered = ({ overscanRowStopIndex, overscanColumnStopIndex }) => {
    const visibleStopIndex = displayGrid ? overscanRowStopIndex * overscanColumnStopIndex : overscanRowStopIndex;

    if (visibleStopIndex >= rowCount - 3 && canLoadMore) {
      loadMore();
    }
  };

  useEffect(() => {
    setHeaderContent(<Search />);
    return () => setHeaderContent(null);
  }, [setHeaderContent, theme]);

  useEffect(() => {
    return () => saveLastScrollPosition(lastScrollPosition.current);
  }, []);

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    const beatmap =
      (displayGrid && beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + columnIndex]) || beatmaps[rowIndex];
    if (beatmap === 0) return <BeatmapSkeleton style={style} />;
    if (!beatmap) return <div style={style} className="NoBeatmap" />;
    return (
      <div style={style}>
        <Beatmap
          noFade
          width="90%"
          autoDl={autoDl && hideDownloaded}
          beatmap={beatmap}
          key={`beatmap${beatmap.beatmapset_id || beatmap.id}`}
        />
      </div>
    );
  };

  return (
    <div
      className={`Beatmaps ${classes.Beatmaps}`}
      onKeyDown={e => e.keyCode === 48 && setAutoDl(!autoDl)}
      tabIndex="0"
      role="button"
      ref={gridContainer}
    >
      <FixedSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={displayGrid ? gridWidth / 2 - 9 : gridWidth - 18}
        rowCount={rowCount}
        rowHeight={250}
        overscanRowCount={7}
        height={gridHeight}
        width={gridWidth}
        onItemsRendered={newItemsRendered}
        onScroll={onScroll}
        initialScrollTop={lastScrollPosition.current}
      >
        {renderBeatmaps}
      </FixedSizeGrid>
    </div>
  );
};

const mapStateToProps = ({ main, settings, beatmaps }) => ({
  searchResults: beatmaps.searchResults,
  window: main.window,
  panelExpended: settings.userPreferences.sidePanelExpended,
});
export default compose(
  connect(mapStateToProps),
  injectSheet(styles),
)(Beatmaps);
