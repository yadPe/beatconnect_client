import React, { useState, useEffect } from 'react';
import { Button, ProgressCircle } from 'react-desktop/windows';
import _ from 'underscore';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import TextInput from '../common/TextInput';
import askBeatconnect from './askBeatconnect';
import DropDown from '../common/DropDown';
import renderIcons from '../../utils/renderIcons';
// import Toggle from '../common/Toggle';
// import Modal, { ToggleContent } from '../common/Modal';

const availableStatus = ['ranked', 'approved', 'qualified', 'loved', 'unranked', 'all'];
const availableModes = ['all', 'std', 'mania', 'taiko', 'ctb'];
const styles = {
  Search: {
    width: '100%',
    display: 'inline-flex',
    '& div, select, input, label': {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  },
  right: {
    marginLeft: 'auto',
  },
  hideDownloaded: {
    cursor: 'pointer',
  },
};

const Search = ({ classes, theme, lastSearch, isBusy, beatmapCount }) => {
  const [search, setSearch] = useState(lastSearch);
  const searchOnEnter = e => {
    if (e.keyCode === 13) {
      execSearch();
    }
  };
  const execSearch = force => {
    if (!_.isEqual(lastSearch, search) || force) {
      askBeatconnect(search, undefined, true);
    }
  };

  useEffect(() => {
    if (
      beatmapCount === 0 ||
      (lastSearch.status !== search.status ||
        lastSearch.mode !== search.mode ||
        lastSearch.hideDownloaded !== search.hideDownloaded)
    )
      execSearch(true);
  }, [search]);

  return (
    <div className={classes.Search}>
      <Button className="btn" push color={theme.color} onClick={execSearch}>
        {isBusy ? (
          <ProgressCircle className="ProgressCircle" color="#fff" size={25} />
        ) : (
          renderIcons('Search', theme.style)
        )}
      </Button>
      <DropDown
        options={availableModes}
        value={search.mode}
        onSelect={e => {
          setSearch({ ...search, mode: e.target.value });
          execSearch();
        }}
      />
      <DropDown
        options={availableStatus}
        value={search.status}
        onSelect={e => {
          setSearch({ ...search, status: e.target.value });
          execSearch();
        }}
      />
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder="Search"
        value={search.query}
        onChange={e => setSearch({ ...search, query: e.target.value })}
        onKeyDown={searchOnEnter}
        onBlur={() => execSearch()}
      />
      <div className={classes.right} />
      {/* Advanced search panel WIP}
      {/* <ToggleContent
        toggle={(isShown, setIsShown) => (
          <div
            title='Advanced filters'
            style={{ margin: 'auto 15px' }}
            onClick={() => setIsShown(!isShown)}
          >
            {renderIcons('Filter', theme.style, isShown ? theme.color : null)}
          </div>
        )}
        content={hide => (
          <Modal
            close={hide}
          >
            There is no spoon...
          <button onClick={hide}>Close</button>
          </Modal>
        )}
      /> */}
      <div
        className={classes.hideDownloaded}
        onClick={() => setSearch({ ...search, hideDownloaded: !search.hideDownloaded })}
        title="Hide downloaded beatmaps"
      >
        {renderIcons('Verified', theme.style, search.hideDownloaded ? theme.color : null)}
      </div>
      {/* <Toggle
        theme={theme}
        checked={search.hideDownloaded}
        onChange={e => setSearch({ ...search, hideDownloaded: e.target.checked })}
      /> */}
    </div>
  );
};

const mapStateToProps = ({ main }) => ({
  lastSearch: main.searchResults.search,
  beatmapCount: main.searchResults.beatmaps.length,
  isBusy: main.fetchingBeatmaps.isFetching,
});
export default connect(mapStateToProps)(injectSheet(styles)(Search));
