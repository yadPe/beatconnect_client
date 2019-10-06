import React, { useEffect, useContext, memo, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet from 'react-jss';
import Beatmap from '../common/Beatmap'
import Search from './Search';
import askBeatconnect from './askBeatconnect';
import store from '../../../store';
import { HistoryContext } from '../../../Providers/HistoryProvider';

const styles = {
  Beatmaps: {
    outline: 'none'
  }
};

const Beatmaps = ({ theme, searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const gridContainer = useRef(null);
  const [autoDl, setAutoDl] = useState(false);
  const history = useContext(HistoryContext);
  const { search, lastScroll, hideDownloaded, lastPage } = searchResults
  let { beatmaps, page } = searchResults
  if (hideDownloaded) beatmaps = beatmaps.filter(({beatmapset_id, id}) => !history.contains(id || beatmapset_id));
  const canLoadMore = hideDownloaded ? !lastPage : beatmaps.length % 50 === 0;
  const lastScrollPosition = useRef(lastScroll || 0)
  if (typeof lastScroll === 'number') {
    lastScrollPosition.current = lastScroll
    if (gridContainer.current) gridContainer.current.childNodes[0].scrollTop = lastScrollPosition.current
  }
  const gridWidth = (window.width - (panelExpended ? 150 : 48))
  const gridHeight = window.height - 79
  const displayGrid = gridWidth >= 1200;
  const rowCount = displayGrid ? Math.ceil(beatmaps.length / 2) : beatmaps.length
  const onScroll = ({ scrollTop }) => lastScrollPosition.current = scrollTop
  const loadMore = () => {
    if ( store.getState().main.fetchingBeatmaps.isFetching ) return console.log('Trying to load more while loading more... What?')
    console.log('loading more..')
    askBeatconnect({ ...search, page: page += 1 })
  }
  if (beatmaps.length < 50 && hideDownloaded && canLoadMore) loadMore();
  const newItemsRendered = ({
    overscanRowStopIndex,
    overscanColumnStopIndex
  }) => {
    const visibleStopIndex = displayGrid ? (overscanRowStopIndex * overscanColumnStopIndex) : overscanRowStopIndex;

    if (visibleStopIndex >= rowCount - 3 && canLoadMore) {
      loadMore()
    }
  };

  useEffect(() => {
    setHeaderContent(<Search theme={theme} />)
    return () => setHeaderContent(null)
  }, [setHeaderContent, theme])

  useEffect(() => {
    return () => store.dispatch({type: 'SAVEBEATMAPSSCROLLPOS', payload: lastScrollPosition.current})
  }, [])

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    const beatmap = displayGrid && beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)] || beatmaps[rowIndex];
    if (!beatmap) return <div style={style} className='NoBeatmap'/>
    return (
      <div style={style}>
        <Beatmap noFade width='90%' autoDl={autoDl && hideDownloaded} theme={theme} beatmap={beatmap} key={`beatmap${beatmap.beatmapset_id || beatmap.id}`} />
      </div>
    )
  }

  return (
    <div
      className={`Beatmaps ${classes.Beatmaps}`}
      onKeyDown={(e) => e.keyCode === 48 && setAutoDl(!autoDl)}
      tabIndex="0"
      ref={gridContainer}
    >
      <FixedSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={displayGrid ? (gridWidth / 2) - 9 : gridWidth - 18}
        rowCount={rowCount}
        rowHeight={250}
        overscanRowCount={7} 
        height={gridHeight}
        width={gridWidth}
        onItemsRendered={newItemsRendered}
        onScroll={onScroll}
        initialScrollTop={lastScrollPosition.current}
        className='customScroll'
      >
        {renderBeatmaps}
      </FixedSizeGrid>
    </div>
  );
}

const mapStateToProps = ({ main, settings }) => ({
  searchResults: main.searchResults,
  window: main.window,
  panelExpended: settings.userPreferences.sidePanelExpended
})
export default connect(mapStateToProps)(injectSheet(styles)(Beatmaps));
