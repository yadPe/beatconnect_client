import store from '../../../../store';

export const onBeatmapSearchResult = searchResults =>
  store.dispatch({ type: 'SEARCH_RESULTS', payload: searchResults });
export const setIsFetchingBeatmaps = isFetching => store.dispatch({ type: 'FETCHINGBEATMAPS', payload: isFetching });
export const saveLastScrollPosition = lastScrollPosition =>
  store.dispatch({ type: 'SAVEBEATMAPSSCROLLPOS', payload: lastScrollPosition });
