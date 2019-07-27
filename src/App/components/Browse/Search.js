import React, { useState, useEffect } from 'react';
import { Button, Text, ProgressCircle } from 'react-desktop/windows';
import TextInput from '../common/TextInput'
import store from '../../../store';

const Search = ({ theme, lastSearch }) => {
  const [search, setSearch] = useState(lastSearch);
  const [isLoading, setIsLoading] = useState(false);

  const askBeatconnect = (query, page) => {
    setIsLoading(true)
    query = query.join('%20')
    fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&p=${page||0}&q=${query}`)
      .then(res => res.json())
      .then(({ beatmaps, max_page }) => {
        store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { search, beatmaps, max_page } })
        //sendResults(beatmaps)
        setIsLoading(false)
      })
  }

  const searchOnEnter = (e) => {
    if (e.keyCode === 13) {
      askBeatconnect(search.split(' '))
    }
  }

  useEffect(() => {
    if (search === '') {
      askBeatconnect('')
    }
  }, [search])

  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Search'
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={searchOnEnter}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => askBeatconnect(search.split(' '))}
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