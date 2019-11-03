import React, { useState, useEffect } from 'react';
import { ProgressCircle } from 'react-desktop/windows';
import _ from 'underscore';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import TextInput from '../common/TextInput';
import askBeatconnect from './askBeatconnect';
import DropDown from '../common/DropDown';
import renderIcons from '../../utils/renderIcons';
import config from '../../../config';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

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

const Search = ({ classes, theme, lastSearch, isBusy, beatmapCount, skeletonBeatmaps }) => {
  const [search, setSearch] = useState(lastSearch);
  const execSearch = force => {
    if (!_.isEqual(lastSearch, search) || force) {
      askBeatconnect(search, undefined, true);
    }
  };
  const searchOnEnter = e => {
    if (e.keyCode === 13) {
      execSearch();
    }
  };

  useEffect(() => {
    if (
      beatmapCount === 0 ||
      skeletonBeatmaps ||
      (lastSearch.status !== search.status ||
        lastSearch.mode !== search.mode ||
        lastSearch.hideDownloaded !== search.hideDownloaded)
    )
      execSearch(true);
  }, [search]);

  return (
    <div className={classes.Search}>
      <Button className="btn" push color={theme.palette.primary.accent} onClick={execSearch}>
        {!isBusy ? (
          <LoadingSpinner />
        ) : (
          // <ProgressCircle className="ProgressCircle" color="#fff" size={25} />
          renderIcons('Search', theme.accentContrast)
        )}
      </Button>
      <DropDown
        options={config.beatmaps.availableModes}
        value={search.mode}
        onSelect={e => {
          setSearch({ ...search, mode: e.target.value });
          execSearch();
        }}
      />
      <DropDown
        options={config.beatmaps.availableStatus}
        value={search.status}
        onSelect={e => {
          setSearch({ ...search, status: e.target.value });
          execSearch();
        }}
      />
      <TextInput
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
            {renderIcons('Filter', theme.style, isShown ? theme.palette.primary.accent : null)}
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
        role="button"
        tabIndex={0}
      >
        {renderIcons('Verified', theme.style, search.hideDownloaded ? theme.palette.primary.accent : null)}
      </div>
      {/* <Toggle
        checked={search.hideDownloaded}
        onChange={e => setSearch({ ...search, hideDownloaded: e.target.checked })}
      /> */}
    </div>
  );
};

const mapStateToProps = ({ main }) => ({
  lastSearch: main.searchResults.search,
  beatmapCount: main.searchResults.beatmaps.length,
  skeletonBeatmaps: main.searchResults.beatmaps[0] === 0,
  isBusy: main.fetchingBeatmaps.isFetching,
});
export default connect(mapStateToProps)(injectSheet(styles)(Search));
