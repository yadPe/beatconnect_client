import React, { useState, useEffect } from 'react';
import { Button, ProgressCircle } from 'react-desktop/windows';
import TextInput from '../common/TextInput'
import askBeatconnect from './askBeatconnect'
import DropDown from '../common/DropDown';
import renderIcons from '../../utils/renderIcons';
import _ from 'underscore';
import { connect } from 'react-redux';

const availableStatus = ['ranked', 'approved', 'qualified', 'loved', 'unranked', 'all'];
const availableModes = ['all', 'std', 'mania', 'taiko', 'ctb']

const Search = ({ theme, lastSearch, isBusy, beatmapCount }) => {
  const [search, setSearch] = useState(lastSearch);
  const [isLoading, setIsLoading] = useState(false);
  const searchOnEnter = (e) => {
    if (e.keyCode === 13) {
      execSearch()
    }
  }
  const execSearch = (force) => {
    if (!_.isEqual(lastSearch, search) || force) {
      askBeatconnect(search, setIsLoading, true)
    }
  }

  useEffect(() => {
    if (beatmapCount === 0) execSearch(true)
  }, [])

  return (
    <React.Fragment>
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={execSearch}
      >
        {
          isLoading || isBusy ?
            <ProgressCircle
              className='ProgressCircle'
              color='#fff'
              size={25}
            /> :
            renderIcons('Search', theme.style)
          // <Text color='fff'>Search</Text>
        }
      </Button>
      <DropDown
        options={availableModes}
        value={search.mode}
        onSelect={(e) => setSearch({ ...search, mode: e.target.value })} />
      <DropDown
        options={availableStatus}
        value={search.status}
        onSelect={(e) => setSearch({ ...search, status: e.target.value })} />
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Search'
        value={search.query}
        onChange={e => setSearch({ ...search, query: e.target.value })}
        onKeyDown={searchOnEnter}
        onBlur={execSearch}
      />
    </React.Fragment>
  );
}

const mapStateToProps = ({ main }) => ({ beatmapCount: main.searchResults.beatmaps.length })
export default connect(mapStateToProps)(Search);