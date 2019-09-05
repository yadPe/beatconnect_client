import React, { useEffect, memo, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet from 'react-jss';
import Beatmap from '../common/Beatmap'
import Search from './Search';
import askBeatconnect from './askBeatconnect';
import store from '../../../store';

const styles = {
  list: {
    // display: 'grid',
    // alignItems: 'center',
    // gridTemplateColumns: 'repeat(auto-fit, minmax(700px, 1fr))',
    // //gridGap: '10px'
  }
};

const Beatmaps = ({ theme, searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const [isLoading, setIsloading] = useState(false);
  const { search, beatmaps, max_page, lastScroll } = searchResults
  let { page } = searchResults
  const canLoadMore = page < max_page
  const lastScrollPosition = useRef(lastScroll || 0)
  const gridWidth = (window.width - (panelExpended ? 150 : 48))
  const gridHeight = window.height - 79
  const displayGrid = gridWidth >= 1200;
  const rowCount = displayGrid ? beatmaps.length / 2 : beatmaps.length
  const onScroll = ({ scrollTop }) => lastScrollPosition.current = scrollTop
  const loadMore = () => {
    if (isLoading) return console.log('NOPE')
    console.log('MORE')
    askBeatconnect({ ...search, page: page += 1 }, setIsloading)
  }
  const newItemsRendered = ({
    overscanRowStopIndex,
    overscanColumnStopIndex
  }) => {
    // const visibleStartIndex = overscanRowStartIndex * overscanColumnStopIndex;
    const visibleStopIndex = displayGrid ? (overscanRowStopIndex * overscanColumnStopIndex) : overscanRowStopIndex;

    if (visibleStopIndex === rowCount - 1 && canLoadMore) {
      loadMore()
    }
  };

  useEffect(() => {
    setHeaderContent(<Search theme={theme} lastSearch={search} isBusy={isLoading} />)
    return () => setHeaderContent(null)
  }, [setHeaderContent, search, theme, isLoading])

  useEffect(() => {
    return () => store.dispatch({type: 'SAVEBEATMAPSSCROLLPOS', payload: lastScrollPosition.current})
  }, [])

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    return (
      <div style={style}>
        {displayGrid ?
          <Beatmap noFade width='90%' theme={theme} beatmap={beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)]} key={`beatmap${beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].beatmapset_id || beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].id}`} />
          :
          <Beatmap noFade width='90%' theme={theme} beatmap={beatmaps[rowIndex]} key={`beatmap${beatmaps[rowIndex].beatmapset_id || beatmaps[rowIndex].id}`} />}
      </div>
    )
  }

  return (
    <div className='Beatmaps'>
      <FixedSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={displayGrid ? (gridWidth / 2) - 9 : gridWidth - 18}
        rowCount={rowCount}
        rowHeight={250}
        overscanCount={7}
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

const areEqual = (prevProps, nextProps) => (JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)) && (JSON.stringify(prevProps.window)) === (JSON.stringify(nextProps.window)) && (prevProps.panelExpended === nextProps.panelExpended)
const mapStateToProps = ({ main, settings }) => ({ searchResults: main.searchResults, window: main.window, panelExpended: settings.userPreferences.sidePanelExpended })
export default connect(mapStateToProps)(memo(injectSheet(styles)(Beatmaps), areEqual));