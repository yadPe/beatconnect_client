import React, { useState, useEffect } from 'react';
import { Button, Text, ProgressCircle } from 'react-desktop/windows';
import TextInput from '../common/TextInput'
import askBeatconnect from './askBeatconnect'

const Search = ({ theme, lastSearch }) => {
  const [search, setSearch] = useState(lastSearch);
  const [isLoading, setIsLoading] = useState(false);

  const searchOnEnter = (e) => {
    if (e.keyCode === 13) {
      askBeatconnect(search, setIsLoading)
    }
  }

  useEffect(() => {
    if (search === '') {
      askBeatconnect('', setIsLoading)
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
        onBlur={() => askBeatconnect(search, setIsLoading)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => askBeatconnect(search, setIsLoading)}
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