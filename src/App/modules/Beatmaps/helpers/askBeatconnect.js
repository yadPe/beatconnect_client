/* eslint-disable no-console */
/* eslint-disable camelcase */
import _ from 'underscore';
import config from '../../../../shared/config';
import store from '../../../../shared/store';
import { setIsFetchingBeatmaps, onBeatmapSearchResult } from '../reducer/actions';

const queryfyAdvancedSearch = advancedSearch =>
  Object.entries(advancedSearch)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return value != '' ? value : null;
      }
      return true;
    })
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}=${value}`;
      }
      return `${key}>=${value.min} ${key}<=${value.max}`;
    })
    .join(' ');

const askBeatconnect = (search, __, resetPage) => {
  const controller = new AbortController();
  let lastPage;
  const { page, query, status, mode, hideDownloaded, advancedSearch } = search;
  let { lastScroll } = search;
  if (resetPage && !page) lastScroll = 0;
  else lastScroll = undefined;
  const { searchResults, fetchingBeatmaps } = store.getState().beatmaps;
  const prevBeatmaps = searchResults.beatmaps;
  if (fetchingBeatmaps && fetchingBeatmaps.isFetching) {
    fetchingBeatmaps.abort();
    setIsFetchingBeatmaps(false);
  }

  const advancedSearchQuery = advancedSearch ? queryfyAdvancedSearch(advancedSearch) : '';
  const formatQuery = encodeURIComponent((query ? query + ' ' : '') + advancedSearchQuery);

  console.log({ query, advancedSearchQuery, finalQuery: (query ? query + ' ' : '') + advancedSearchQuery });

  fetch(config.api.searchBeatmaps(formatQuery, page, status, mode), {
    signal: controller.signal,
  })
    .then(res => res.ok && res.json())
    .then(({ beatmaps, max_page, error, error_message }) => {
      if (error) throw new Error(`${error_message} For query ${search}`);
      if (beatmaps.length === 0) lastPage = true;
      if (page > 0) beatmaps = _.union(prevBeatmaps, beatmaps);
      setIsFetchingBeatmaps(false);
      onBeatmapSearchResult({
        search,
        beatmaps: beatmaps || [],
        max_page,
        page: page || 0,
        hideDownloaded,
        lastPage,
        lastScroll,
      });
    })
    .catch(err => {
      console.error(err);
      err.name !== 'AbortError' && setIsFetchingBeatmaps(false);
    });
  store.dispatch({ type: 'FETCHINGBEATMAPS', payload: { isFetching: true, abort: controller.abort.bind(controller) } });
};

export default askBeatconnect;
