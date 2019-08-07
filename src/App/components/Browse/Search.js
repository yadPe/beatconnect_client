import React, { useState, useEffect } from 'react';
import { Button, Text, ProgressCircle } from 'react-desktop/windows';
import TextInput from '../common/TextInput'
import askBeatconnect from './askBeatconnect'
import DropDown from '../common/DropDown';

const availableStatus = ['ranked', 'approved', 'qualified', 'loved', 'unranked', 'all'];
const availableModes = ['all', 'std', 'mania', 'taiko', 'ctb']

const Search = ({ theme, lastSearch }) => {
  const [search, setSearch] = useState(lastSearch);
  const [isLoading, setIsLoading] = useState(false);

  const searchOnEnter = (e) => {
    if (e.keyCode === 13) {
      askBeatconnect(search, setIsLoading)
    }
  }

  useEffect(() => {
    if (search.query === '') {
      askBeatconnect(search, setIsLoading)
    }
  }, [search])

  return (
    <React.Fragment>
      <DropDown
        options={availableModes}
        value={search.mode}
        onSelect={(e) => { setSearch({ ...search, mode: e.target.value }); askBeatconnect({ ...search, mode: e.target.value }, setIsLoading) }} />
      <DropDown
        options={availableStatus}
        value={search.status}
        onSelect={(e) => { setSearch({ ...search, status: e.target.value }); askBeatconnect({ ...search, status: e.target.value }, setIsLoading) }} />
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Search'
        value={search.query}
        onChange={e => setSearch({ ...search, query: e.target.value })}
        onKeyDown={searchOnEnter}
        onBlur={() => askBeatconnect(search, setIsLoading)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
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