import React, { useState } from 'react';
import test from '../testSearchResult'
import Beatmap from '../common/Beatmap'
import Search from './Search';

const Browse = ({theme}) => {
  const [results, setResults] = useState([])
  return (
        <div className='menuContainer Browse' style={{transition: 'background 0ms'}}>
          <Search sendResults={setResults} theme={theme}/>
          {results.map(beatmap => <Beatmap theme={theme} beatmap={beatmap} />)}
        </div>
    );
}

export default Browse;