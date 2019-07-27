import React, { useState } from 'react';
import { connect } from 'react-redux';
import test from '../testSearchResult'
import Beatmap from '../common/Beatmap'
import Search from './Search';


const Browse = ({theme, searchResults}) => {
  const { search, beatmaps } = searchResults
  return (
        <div className='menuContainer Browse' style={{transition: 'background 0ms'}}>
          <Search theme={theme} lastSearch={search}/>
          {beatmaps.map(beatmap => <Beatmap theme={theme} beatmap={beatmap} key={`beatmap${beatmap.beatmapset_id || beatmap.id}`}/>)}
        </div>
    );
}

const mapStateToProps = ({main}) => ({searchResults: main.searchResults})
export default connect(mapStateToProps)(Browse);