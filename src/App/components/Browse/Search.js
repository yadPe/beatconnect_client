import React, { useState } from 'react';
import { Button, Text } from 'react-desktop/windows';
import TextInput from '../common/TextInput'

const Search = ({ theme, sendResults }) => {
  const [ search, setSearch ] = useState('');

  const askBeatconnect = (query) => {
      fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&q=${query}`)
      .then(res => res.json())
      .then(({beatmaps}) => sendResults(beatmaps))
  }

  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Search'
        value={search}
        onChange={ e => setSearch(e.target.value)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => askBeatconnect(search)}
      >
        <Text color='fff'>Search</Text>
      </Button>
    </React.Fragment>
  );
}

export default Search;