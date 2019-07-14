import React, { useState } from 'react';
import test from '../testSearchResult'
import Beatmap from '../Matchs/MatchDetails/Beatmap'
import Search from './Search';

const Browse = ({theme}) => {
  const [results, setResults] = useState([])
  return (
        <div>
          <Search sendResults={setResults} theme={theme}/>
          {results.map(beatmap => <Beatmap theme={theme} beatmap={beatmap} />)}
        </div>
    );
}

export default Browse;