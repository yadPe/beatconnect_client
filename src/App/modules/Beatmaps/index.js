/* eslint-disable camelcase */
import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { VariableSizeGrid } from 'react-window';
import injectSheet, { useTheme } from 'react-jss';
import Beatmap from '../common/Beatmap';
import Search from './components/Search';
import askBeatconnect from './helpers/askBeatconnect';
import store from '../../../shared/store';
import { HistoryContext } from '../../Providers/HistoryProvider';
import BeatmapSkeleton from '../common/Beatmap/beatmap.skeleton';
import config from '../../../shared/config';
import { saveLastScrollPosition } from './reducer/actions';

// TODO Check if osu is running button works well
// TODO Add fade in for every section
const styles = {
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  Beatmaps: {
    outline: 'none',
    opacity: 0,
    animation: '128ms linear forwards $fadeIn',
  },
};

const Beatmaps = ({ searchResults, classes, setHeaderContent, window }) => {
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
  const gridWidth = window.width - config.display.sidePanelCompactedLength - 1;
  const gridHeight = window.height - 1;
  const displayGrid = gridWidth >= 1000;
  const rowCount = (displayGrid ? Math.ceil(beatmaps.length / 2) : beatmaps.length) + 1; // Add one for the invisible top placeholder
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

  const getColumnWidth = useCallback(() => (displayGrid ? gridWidth / 2 - 9 : gridWidth - 18), [
    displayGrid,
    gridWidth,
  ]);

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    if (rowIndex === 0) return <div style={{ height: `${config.display.topBarHeight}px` }} />;
    const beatmap = displayGrid ? beatmaps[rowIndex * 2 + columnIndex - 2] : beatmaps[rowIndex - 1];
    if (beatmap === 0) return <BeatmapSkeleton style={style} rowIndex={rowIndex} />;
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
      <VariableSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={getColumnWidth}
        estimatedColumnWidth={getColumnWidth()}
        estimatedRowHeight={250}
        rowCount={rowCount}
        rowHeight={index => (index === 0 ? config.display.topBarHeight : 250)}
        overscanRowCount={7}
        height={gridHeight}
        width={gridWidth}
        onItemsRendered={newItemsRendered}
        onScroll={onScroll}
        initialScrollTop={lastScrollPosition.current}
        key={getColumnWidth()}
      >
        {renderBeatmaps}
      </VariableSizeGrid>
    </div>
  );
};

const mapStateToProps = ({ app, beatmaps }) => ({
  searchResults: beatmaps.searchResults,
  window: app.window,
});
export default compose(
  connect(mapStateToProps),
  injectSheet(styles),
)(Beatmaps);
