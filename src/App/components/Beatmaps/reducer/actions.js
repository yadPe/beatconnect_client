import store from '../../../../store';

const onBeatmapSearchResult = searchResults => store.dispatch({ type: 'SEARCH_RESULTS', payload: searchResults });
const setIsFetchingBeatmaps = isFetching => store.dispatch({ type: 'FETCHINGBEATMAPS', payload: isFetching });
const saveLastScrollPosition = lastScrollPosition =>
  store.dispatch({ type: 'SAVEBEATMAPSSCROLLPOS', payload: lastScrollPosition });

export default {
  onBeatmapSearchResult,
  setIsFetchingBeatmaps,
  saveLastScrollPosition,
};
