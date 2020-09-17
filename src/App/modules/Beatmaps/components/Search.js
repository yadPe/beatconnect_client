import React, { useState, useEffect } from 'react';
import { remote } from 'electron';
import { ProgressCircle } from 'react-desktop/windows';
import { zip, isEqual } from 'underscore';
import { connect } from 'react-redux';
import { useTheme, createUseStyles } from 'react-jss';
import TextInput from '../../common/TextInput';
import askBeatconnect from '../helpers/askBeatconnect';
import DropDown from '../../common/DropDown';
import renderIcons from '../../../helpers/renderIcons';
import config from '../../../../shared/config';
import Button from '../../common/Button';
import { getDragRegion } from '../../../helpers/css.utils';

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
    right: '20px',
    top: '20px',
    position: 'absolute',
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

  const togleHideDownloaded = () => {
    if (!search.hideDownloaded) trackEvent('beatmap', 'search', 'enableHideDownloaded');
    setSearch({ ...search, hideDownloaded: !search.hideDownloaded });
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
      <div className={classes.searchButtonWrapper}>
        <Button className="btn" color={theme.palette.primary.accent} onClick={execSearch}>
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
        onClick={togleHideDownloaded}
        title="Hide downloaded beatmaps"
        role="button"
        tabIndex={0}
      >
        {renderIcons({ name: 'Verified', color: search.hideDownloaded && theme.palette.primary.accent })}
      </div>
    </div>
  );
};

const mapStateToProps = ({ beatmaps }) => ({
  lastSearch: beatmaps.searchResults.search,
  beatmapCount: beatmaps.searchResults.beatmaps.length,
  skeletonBeatmaps: beatmaps.searchResults.beatmaps[0] === 0,
  isBusy: beatmaps.fetchingBeatmaps.isFetching,
});
export default connect(mapStateToProps)(Search);
