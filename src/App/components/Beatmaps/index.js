import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet from 'react-jss';
import Beatmap from '../common/Beatmap'
import Search from './Search';
// https://blog.logrocket.com/rendering-large-lists-with-react-virtualized-82741907a6b3/
// https://web.dev/virtualize-long-lists-react-window

const styles = {
  list: {
    // display: 'grid',
    // alignItems: 'center',
    // gridTemplateColumns: 'repeat(auto-fit, minmax(700px, 1fr))',
    // //gridGap: '10px'
  }
};

const Beatmaps = ({ theme, searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const { search, beatmaps } = searchResults
  const gridWidth = (window.width - (panelExpended ? 150 : 48))
  const gridHeight = window.height - 79
  const displayGrid = gridWidth >= 960;

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
      <FixedSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={displayGrid ? (gridWidth / 2)-9 : gridWidth - 18}
        rowCount={displayGrid ? beatmaps.length / 2 : beatmaps.length}
        rowHeight={250}
        overscanCount={10}
        height={gridHeight}
        width={gridWidth}
      >
        {renderBeatmaps}
      </FixedSizeGrid>
    </div>
  );
}

const areEqual = (prevProps, nextProps) => (JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)) && (JSON.stringify(prevProps.window)) === (JSON.stringify(nextProps.window))
const mapStateToProps = ({ main, settings }) => ({ searchResults: main.searchResults, window: main.window, panelExpended: settings.userPreferences.sidePanelExpended })
export default connect(mapStateToProps)(memo(injectSheet(styles)(Beatmaps), areEqual));