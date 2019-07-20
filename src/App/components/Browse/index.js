import React, { useState } from 'react';
import { connect } from 'react-redux';
import test from '../testSearchResult'
import Beatmap from '../common/Beatmap'
import Search from './Search';


const Browse = ({theme, searchResults}) => {
  return (
        <div className='menuContainer Browse' style={{transition: 'background 0ms'}}>
          <Search theme={theme}/>
          {searchResults.map(beatmap => <Beatmap theme={theme} beatmap={beatmap} />)}
        </div>
    );
}

const mapStateToProps = ({main}) => ({searchResults: main.searchResults})
export default connect(mapStateToProps)(Browse);