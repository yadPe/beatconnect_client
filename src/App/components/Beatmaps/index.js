import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet from 'react-jss';
import Beatmap from '../common/Beatmap'
import Search from './Search';
import askBeatconnect from './askBeatconnect';
import InfiniteLoader from "react-window-infinite-loader";
import {convertFromGridToInfiniteProps as onItemsRendered} from './convertFromGridToInfiniteProps';
// https://blog.logrocket.com/rendering-large-lists-with-react-virtualized-82741907a6b3/
// https://web.dev/virtualize-long-lists-react-window
// https://github.com/bvaughn/react-window-infinite-loader/issues/3
// 

const styles = {
  list: {
    // display: 'grid',
    // alignItems: 'center',
    // gridTemplateColumns: 'repeat(auto-fit, minmax(700px, 1fr))',
    // //gridGap: '10px'
  }
};

const Beatmaps = ({ theme, searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const { search, beatmaps, max_page } = searchResults
  const gridWidth = (window.width - (panelExpended ? 150 : 48))
  const gridHeight = window.height - 79
  const displayGrid = gridWidth >= 960;
  console.log(max_page)
  const canLoadMore = search.page < max_page
  const loadMore = () => {
    console.log('more')
    askBeatconnect({ ...search, page: search.page += 1 })
  }

  useEffect(() => {
    setHeaderContent(<Search theme={theme} lastSearch={search} />)
    return () => setHeaderContent(null)
  }, [setHeaderContent, search, theme])

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    return (
      <div style={style}>
        {displayGrid ?
          <Beatmap width='90%' theme={theme} beatmap={beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)]} key={`beatmap${beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].beatmapset_id || beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].id}`} />
          :
          <Beatmap width='90%' theme={theme} beatmap={beatmaps[rowIndex]} key={`beatmap${beatmaps[rowIndex].beatmapset_id || beatmaps[rowIndex].id}`} />}
      </div>
    )
  }

  return (
    <div className='Beatmaps'>
      <InfiniteLoader
      isItemLoaded={index => index < beatmaps.length}
      loadMoreItems={loadMore}
      itemCount={beatmaps.length}
      >
        {({ onItemsRendered, ref }) => {
          const newItemsRendered = gridData => {
            const {
              visibleRowStartIndex,
              visibleRowStopIndex,
              visibleColumnStopIndex,
              overscanRowStartIndex,
              overscanRowStopIndex,
              overscanColumnStopIndex
            } = gridData;

            const endCol =
              (this.props.useOverscanForLoading || true
                ? overscanColumnStopIndex
                : visibleColumnStopIndex) + 1;

            const startRow =
              this.props.useOverscanForLoading || true
                ? overscanRowStartIndex
                : visibleRowStartIndex;
            const endRow =
              this.props.useOverscanForLoading || true
                ? overscanRowStopIndex
                : visibleRowStopIndex;

            const visibleStartIndex = startRow * endCol;
            const visibleStopIndex = endRow * endCol;

            onItemsRendered({
              //call onItemsRendered from InfiniteLoader so it can load more if needed
              visibleStartIndex,
              visibleStopIndex
            });
          };
          return (
          <FixedSizeGrid
            columnCount={displayGrid ? 2 : 1}
            columnWidth={displayGrid ? (gridWidth / 2) - 9 : gridWidth - 18}
            rowCount={displayGrid ? beatmaps.length / 2 : beatmaps.length}
            rowHeight={250}
            overscanCount={10}
            height={gridHeight}
            width={gridWidth}
            onItemsRendered={newItemsRendered}
            ref={ref}
          >
            {renderBeatmaps}
          </FixedSizeGrid>
        )}}
      </InfiniteLoader>
    </div>
  );
}

const areEqual = (prevProps, nextProps) => (JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)) && (JSON.stringify(prevProps.window)) === (JSON.stringify(nextProps.window))
const mapStateToProps = ({ main, settings }) => ({ searchResults: main.searchResults, window: main.window, panelExpended: settings.userPreferences.sidePanelExpended })
export default connect(mapStateToProps)(memo(injectSheet(styles)(Beatmaps), areEqual));