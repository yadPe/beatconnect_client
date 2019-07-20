import React, { useState } from 'react';
import { Button, Text, ProgressCircle } from 'react-desktop/windows';
import TextInput from '../common/TextInput'
import store from '../../../store';

const Search = ({ theme, sendResults }) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askBeatconnect = (query) => {
    setIsLoading(true)
    fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&q=${query}`)
      .then(res => res.json())
      .then(({ beatmaps }) => {
        store.dispatch({type: 'SEARCH_RESULTS', searchResults: beatmaps})
        //sendResults(beatmaps)
        setIsLoading(false)
      })
  }

  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Search'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => askBeatconnect(search)}
      >
        {
          isLoading ?
            <ProgressCircle
              className='ProgressCircle'
              color='#fff'
              size={25}
            /> :
            <Text color='fff'>Search</Text>
        }
      </Button>
    </React.Fragment>
  );
}

export default Search;