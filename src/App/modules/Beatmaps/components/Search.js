import React, { useState, useEffect, useReducer } from 'react';
import { remote } from 'electron';
import ProgressCircle from '../../common/ProgressCircle';
import { zip, isEqual } from 'underscore';
import { connect } from 'react-redux';
import { useTheme, createUseStyles } from 'react-jss';
import TextInput from '../../common/TextInput';
import askBeatconnect from '../helpers/askBeatconnect';
import DropDown from '../../common/DropDown';
import { AdvancedSearch } from './AdvancedSearch';
import renderIcons from '../../../helpers/renderIcons';
import config from '../../../../shared/config';
import Button from '../../common/Button';
import { getDragRegion } from '../../../helpers/css.utils';
import { getActiveSectionParams } from '../../../app.selectors';

const { trackEvent } = remote.getGlobal('tracking');

const useStyle = createUseStyles({
  Search: {
    ...getDragRegion(true),
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
    margin: 'auto 5px',
  },
  searchButtonWrapper: {
    margin: 8,
  },
});

const Search = ({ lastSearch, isBusy, beatmapCount, skeletonBeatmaps, deepLinkSearch }) => {
  const [search, setSearch] = useState(lastSearch);

  const theme = useTheme();
  const classes = useStyle();

  const execSearch = force => {
    if (force || !isEqual(lastSearch, search)) {
      askBeatconnect(search, undefined, true);
    }
  };
  useEffect(() => {
    if (deepLinkSearch.beatmapsetId) {
      const s = { query: deepLinkSearch.beatmapsetId, status: 'all', mode: 'all' };
      setSearch(s);
      askBeatconnect(s, undefined, true);
    }
  }, [deepLinkSearch.beatmapsetId]);
  const searchOnEnter = e => {
    if (e.keyCode === 13) {
      execSearch();
    }
  };

  const togleHideDownloaded = () => {
    if (!search.hideDownloaded) trackEvent('beatmap', 'search', 'enableHideDownloaded');
    setSearch({ ...search, hideDownloaded: !search.hideDownloaded });
  };

  useEffect(() => {
    if (
      beatmapCount === 0 ||
      skeletonBeatmaps ||
      lastSearch.status !== search.status ||
        lastSearch.mode !== search.mode ||
        lastSearch.hideDownloaded !== search.hideDownloaded ||
        lastSearch.advancedSearch !== search.advancedSearch
    )
      execSearch(true);
  }, [search]);

  return (
    <div className={classes.Search}>
      <div className={classes.searchButtonWrapper}>
        <Button className="btn" color={theme.palette.primary.accent} onClick={() => execSearch()}>
          {isBusy ? <ProgressCircle /> : renderIcons({ name: 'Search', style: theme.accentContrast })}
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
      <div
        className={classes.hideDownloaded}
        onClick={togleHideDownloaded}
        title="Hide downloaded beatmaps"
        role="button"
      >
        <div className={classes.right} />
        {renderIcons({ name: 'Verified', color: search.hideDownloaded && theme.palette.primary.accent })}
      </div>
      <AdvancedSearch
        onSubmit={advancedSearch => {
          setSearch(search => {
            return { ...search, advancedSearch };
          });
        }}
        lastSearchValues={lastSearch.advancedSearch}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  lastSearch: state.beatmaps.searchResults.search,
  beatmapCount: state.beatmaps.searchResults.beatmaps.length,
  skeletonBeatmaps: state.beatmaps.searchResults.beatmaps[0] === 0,
  isBusy: state.beatmaps.fetchingBeatmaps.isFetching,
  deepLinkSearch: getActiveSectionParams(state),
});
export default connect(mapStateToProps)(Search);
