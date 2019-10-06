import store from '../../../store';
import _ from 'underscore';

const askBeatconnect = (search, __, resetPage) => {
  const controller = new AbortController();
  let lastPage;
  const { query, status, mode, hideDownloaded } = search;
  let { page, lastScroll } = search
  console.log('resetPage && page', resetPage, page, lastScroll)
  if (resetPage && !page) lastScroll = page = 0;
  const { searchResults, fetchingBeatmaps } = store.getState().main;
  const prevBeatmaps = searchResults.beatmaps;
  console.log(fetchingBeatmaps, search)
  if (fetchingBeatmaps && fetchingBeatmaps.isFetching) {
    fetchingBeatmaps.abort();
    store.dispatch({ type: 'FETCHINGBEATMAPS', payload: { isFetching: false } });
  }
  console.log(fetchingBeatmaps, search)
  const formatQuery = query.split(' ').join('%20')
  fetch(`https://beatconnect.io/api/search/?token=b3z8gl9pzt7iqa89&p=${page || 0}&q=${formatQuery}&s=${status || 'ranked'}&m=${mode || 'all'}`,
    { signal: controller.signal }
  )
    .then(res => res.ok && res.json())
    .then(({ beatmaps, max_page, error, error_message }) => {
      if (error) throw new Error(error_message + ' For query ' + search);
      if (beatmaps.length === 0) lastPage = true;
      if (page > 0) beatmaps = _.union(prevBeatmaps, beatmaps);
      store.dispatch({ type: 'FETCHINGBEATMAPS', payload: { isFetching: false } });
      store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { search, beatmaps: beatmaps || [], max_page, page: page || 0, hideDownloaded, lastPage, lastScroll } })
    })
    .catch((err) => {
      console.error(err);
      err.name !== 'AbortError' && store.dispatch({ type: 'FETCHINGBEATMAPS', payload: { isFetching: false } });
    });
  store.dispatch({ type: 'FETCHINGBEATMAPS', payload: { isFetching: true, abort: controller.abort.bind(controller) } });
}

export default askBeatconnect