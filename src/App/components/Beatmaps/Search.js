import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { ProgressCircle } from 'react-desktop/windows';
import { zip, isEqual } from 'underscore';
import { connect } from 'react-redux';
import { useTheme, createUseStyles } from 'react-jss';
import TextInput from '../common/TextInput';
import askBeatconnect from './askBeatconnect';
import DropDown from '../common/DropDown';
import renderIcons from '../../utils/renderIcons';
import config from '../../../config';
import Button from '../common/Button';

const useStyle = createUseStyles({
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
  searchButtonWrapper: {
    margin: 8,
  },
});

const Search = ({ lastSearch, isBusy, beatmapCount, skeletonBeatmaps }) => {
  const [search, setSearch] = useState(lastSearch);
  const theme = useTheme();
  const classes = useStyle();
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

  const test = () => {
    ipcRenderer.send('download-beatmap', { beatmapSetId: '1080224', uniqId: 'VZik6KIO' }); // https://beatconnect.io/b/1080224/VZik6KIO/
  };

  return (
    <div className={classes.Search}>
      <div className={classes.searchButtonWrapper}>
        <Button className="btn" push color={theme.palette.primary.accent} onClick={test} icon>
          {isBusy ? (
            <ProgressCircle className="ProgressCircle" color="#fff" size={17} />
          ) : (
            renderIcons({ name: 'Search', style: theme.accentContrast })
          )}
        </Button>
      </div>
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
        {renderIcons({ name: 'Verified', color: search.hideDownloaded && theme.palette.primary.accent })}
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
export default connect(mapStateToProps)(Search);
