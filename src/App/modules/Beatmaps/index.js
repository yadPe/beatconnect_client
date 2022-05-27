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
import { getFadeIn, sectionSwitchAnimation } from '../../helpers/css.utils';

const styles = {
  ...getFadeIn(),
  Beatmaps: {
    outline: 'none',
    overflow: 'hidden',
    ...sectionSwitchAnimation(),
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
  const minItemWidth = 500;
  const gridWidth = window.width - config.display.sidePanelCompactedLength;
  const gridHeight = window.height;
  const displayGrid = gridWidth >= 1000;
  const columnCount = Math.floor(window.width / minItemWidth);
  const rowCount = (displayGrid ? Math.ceil(beatmaps.length / columnCount) : beatmaps.length) + 1; // Add one for the invisible top placeholder
  const canLoadMore = hideDownloaded ? !lastPage : beatmaps.length % 50 === 0;
  const onScroll = ({ scrollTop }) => {
    lastScrollPosition.current = scrollTop;
  };
  const loadMore = () => {
    if (!store.getState().beatmaps.fetchingBeatmaps.isFetching) askBeatconnect({ ...search, page: (page += 1) });
  };
  if (beatmaps.length < 50 && hideDownloaded && canLoadMore) loadMore();
  const newItemsRendered = ({ overscanRowStopIndex }) => {
    if (overscanRowStopIndex >= rowCount - (columnCount + 1) && canLoadMore) {
      loadMore();
    }
  };

  useEffect(() => {
    setHeaderContent(<Search />);
    return () => setHeaderContent(null);
  }, [setHeaderContent, theme]);

  useEffect(() => {
    saveLastScrollPosition(lastScrollPosition.current);
  }, []);

  // Some magic number are being invoked here please don't pay attention
  const getColumnWidth = useCallback(() => (displayGrid ? gridWidth / columnCount - 4 : gridWidth - 8), [
    displayGrid,
    gridWidth,
    columnCount,
  ]);

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    const beatmap = displayGrid ? beatmaps[rowIndex * columnCount + columnIndex - columnCount] : beatmaps[rowIndex - 1];
    if (beatmap === 0) return <BeatmapSkeleton style={style} rowIndex={rowIndex} />;
    if (!beatmap) return <div style={style} className="NoBeatmap" />;
    return (
      <div style={style}>
        <Beatmap
          noFade
          width="95%"
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
        columnCount={displayGrid ? columnCount : 1}
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
export default compose(connect(mapStateToProps), injectSheet(styles))(Beatmaps);
