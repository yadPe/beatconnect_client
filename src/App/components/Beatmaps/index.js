import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { FixedSizeGrid } from 'react-window';
import injectSheet from 'react-jss';
import Beatmap from '../common/Beatmap'
import Search from './Search';
// https://blog.logrocket.com/rendering-large-lists-with-react-virtualized-82741907a6b3/
// https://web.dev/virtualize-long-lists-react-window

const styles = {
  list: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'repeat(auto-fit, minmax(700px, 1fr))',
    //gridGap: '10px'
  },
  item: {
    // margin: '10%'
  }
};

const Beatmaps = ({ theme, searchResults, classes, setHeaderContent, window, panelExpended }) => {
  const { search, beatmaps } = searchResults
  const displayGrid = window.width - (panelExpended ? 150 : 44) >= 700;

  useEffect(() => {
    setHeaderContent(<Search theme={theme} lastSearch={search} />)
    return () => setHeaderContent(null)
  }, [setHeaderContent, search, theme])

  const renderBeatmaps = ({ columnIndex, rowIndex, style }) => {
    return (
      <div style={style} className={classes.item}>
        <Beatmap width='90%' theme={theme} beatmap={beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)]} key={`beatmap${beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].beatmapset_id || beatmaps[(rowIndex === 0 ? 0 : rowIndex + rowIndex) + (columnIndex)].id}`} />
      </div>
    )
  }

  console.log((window.width / 2) - 100)
  return (
    <div className='Beatmaps' >
      <FixedSizeGrid
        columnCount={displayGrid ? 2 : 1}
        columnWidth={(window.width / 2) - 100}
        rowCount={displayGrid ? beatmaps.length / 2 : beatmaps.length}
        rowHeight={222}
        overscanCount={10}
        height={window.height - 79}
        width={(window.width - (panelExpended ? 150 : 44))}
      >
        {renderBeatmaps}
      </FixedSizeGrid>
    </div>
  );
}

const mapStateToProps = ({ main, settings }) => ({ searchResults: main.searchResults, window: main.window, panelExpended: settings.userPreferences.sidePanelExpended })
export default connect(mapStateToProps)(injectSheet(styles)(Beatmaps));