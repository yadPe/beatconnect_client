import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import test from '../testSearchResult'
import Beatmap from '../common/Beatmap'
import Search from './Search';
import VizSensor from 'react-visibility-sensor';


const Browse = ({ theme, searchResults }) => {
  const { search, beatmaps } = searchResults
  const that = React.createRef();

  const renderBeatmaps = () => {
    return beatmaps.map((beatmap, i) => {
      return beatmaps.length - i === 5 ?
        <VizSensor
          onChange={() => console.log('yeeeeeaa')}>
          <Beatmap theme={theme} beatmap={beatmap} key={`beatmap${beatmap.beatmapset_id || beatmap.id}`} />
        </VizSensor> :
        <Beatmap theme={theme} beatmap={beatmap} key={`beatmap${beatmap.beatmapset_id || beatmap.id}`} />
    })
  }

  return (
    <div className='menuContainer Browse' ref={that} style={{ transition: 'background 0ms' }}>
      <Search theme={theme} lastSearch={search} />
      {renderBeatmaps()}
    </div>
  );
}

const mapStateToProps = ({ main }) => ({ searchResults: main.searchResults })
export default connect(mapStateToProps)(Browse);