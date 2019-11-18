import React, { useState, useEffect } from 'react';
import { ProgressCircle } from 'react-desktop/windows';
import { zip, isEqual } from 'underscore';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import TextInput from '../common/TextInput';
import askBeatconnect from './askBeatconnect';
import DropDown from '../common/DropDown';
import renderIcons from '../../utils/renderIcons';
import config from '../../../config';
import Button from '../common/Button';

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
    if (!isEqual(lastSearch, search) || force) {
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
      <Button className="btn" push color={theme.palette.primary.accent} onClick={execSearch} icon>
        {isBusy ? (
          <ProgressCircle className="ProgressCircle" color="#fff" size={17} />
        ) : (
          renderIcons('Search', theme.accentContrast)
        )}
      </Button>
      <DropDown
        options={zip(config.beatmaps.availableModesLabels, config.beatmaps.availableModes)}
        value={search.mode}
        onSelect={e => {
          setSearch({ ...search, mode: e.target.value });
          execSearch();
        }}
      />
      <DropDown
        options={zip(config.beatmaps.availableStatusLabels, config.beatmaps.availableStatus)}
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
      <div
        className={classes.hideDownloaded}
        onClick={() => setSearch({ ...search, hideDownloaded: !search.hideDownloaded })}
        title="Hide downloaded beatmaps"
        role="button"
        tabIndex={0}
      >
        {renderIcons('Verified', theme.style, search.hideDownloaded ? theme.palette.primary.accent : null)}
      </div>
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
