import React, { useState, useEffect, useReducer } from 'react';
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
import { useDisclosure, Modal } from '../../common/Modal';

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
  AdvancedSearchModal: {
    margin: '-5px 0',
    '& p': {
      margin: '5px 0',
    },
  },
});

const defaultValues = {
  title: '',
  artist: '',
  creator: '',
  tags: '',
  title: '',
  mapset: '',
  difficulty: '',
  cs: {
    min: null,
    max: null,
  },
  ar: {
    min: null,
    max: null,
  },
  hp: {
    min: null,
    max: null,
  },
  stars: {
    min: null,
    max: null,
  },
  bpm: {
    min: null,
    max: null,
  },
  length: {
    min: null,
    max: null,
  },
  drain: {
    min: null,
    max: null,
  },
  favcount: {
    min: null,
    max: null,
  },
};

let formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TEXT_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'UPDATE_RANGE_FIELD':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          [action.variant]: action.value,
        },
      };

    default:
      return state;
  }
};

const AdvancedSearchModal = () => {
  const modal = useDisclosure(true);
  const classes = useStyle();
  const theme = useTheme();

  const [formState, dispatch] = useReducer(formReducer, defaultValues);

  const handleTextFieldChange = e => {
    dispatch({
      type: 'UPDATE_TEXT_FIELD',
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleRangeFieldChange = (e, variant) => {
    dispatch({
      type: 'UPDATE_RANGE_FIELD',
      field: e.target.name,
      variant: variant,
      value: e.target.value,
    });
  };
  console.log(Object.entries(formState));
  return (
    <>
      <Button className="btn" color={theme.palette.primary.accent} onClick={() => modal.show()}>
        {renderIcons({ name: 'Settings', style: theme.accentContrast })}
      </Button>
      {modal.isOpen && (
        <Modal title="Advanced Search" hide={modal.hide}>
          <form className={classes.AdvancedSearchModal} style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.entries(formState).map(([key, value]) => {
              if (typeof value === 'string') {
                return (
                  <label>
                    {key}:{' '}
                    <input name={key} type="text" value={formState[key]} onChange={handleTextFieldChange}></input>
                  </label>
                );
              }
              return (
                <label>
                  {key}:{' '}
                  <input
                    name={key}
                    type="number"
                    value={formState[key].min}
                    onChange={e => handleTextFieldChange(e, 'min')}
                  ></input>{' '}
                  <input
                    name={key}
                    type="number"
                    value={formState[key].max}
                    onChange={e => handleTextFieldChange(e, 'max')}
                  ></input>
                </label>
              );
            })}
          </form>
        </Modal>
      )}
    </>
  );
};

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
      <div
        className={classes.hideDownloaded}
        onClick={togleHideDownloaded}
        title="Hide downloaded beatmaps"
        role="button"
      >
        <div className={classes.right} />
        {renderIcons({ name: 'Verified', color: search.hideDownloaded && theme.palette.primary.accent })}
      </div>
      <AdvancedSearchModal />
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
