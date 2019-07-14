import React, { useState } from 'react';
import { Button, Text, TextInput } from 'react-desktop/windows';

const Search = ({ theme, sendResults }) => {
  const [ search, setSearch ] = useState('');

  const callBeatconnect = (query) => {
      fetch(`https://beatconnect.io/api//search/?token=3u80rns2wkcidsz7&q=${query}`)
      .then(res => res.json())
      .then(({beatmaps}) => sendResults(beatmaps))
  }

  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Match ID'
        value={search}
        onChange={ e => setSearch(e.target.value)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => callBeatconnect(search)}
      >
        <Text color='fff'>Search</Text>
      </Button>
    </React.Fragment>
  );
}

export default Search;