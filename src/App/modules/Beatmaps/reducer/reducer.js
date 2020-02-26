const initialState = {
  fetchingBeatmaps: {},
  searchResults: {
    search: { query: '', mode: 'all', status: 'ranked', page: 0 },
    beatmaps: new Array(8).fill(0),
  },
  lastScrollPosition: 0,
  switchingWallpaper: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SEARCH_RESULTS':
      return { ...state, searchResults: payload };
    case 'SAVEBEATMAPSSCROLLPOS':
      return { ...state, searchResults: { ...state.searchResults, lastScroll: payload } };
    case 'FETCHINGBEATMAPS':
      return { ...state, fetchingBeatmaps: payload };
    case 'SET_WALLPAPER':
      return { ...state, switchingWallpaper: payload };
    default:
      return state;
  }
};
