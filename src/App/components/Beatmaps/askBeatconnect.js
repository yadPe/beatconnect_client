import store from '../../../store';
import _ from 'underscore';

const askBeatconnect = (search, onLoading, resetPage) => {
  let lastPage;
  const { query, status, mode, hideDownloaded } = search;
  let { page } = search
  if (resetPage) page = 0
  const prevBeatmaps = store.getState().main.searchResults.beatmaps
  onLoading(true)
  const formatQuery = query.split(' ').join('%20')
  fetch(`https://beatconnect.io/api/search/?token=b3z8gl9pzt7iqa89&p=${page || 0}&q=${formatQuery}&s=${status || 'ranked'}&m=${mode || 'all'}`)
    .then(res => res.json())
    .then(({ beatmaps, max_page, error, error_message }) => {
      if (error) {
        console.error(error_message, 'For query', search)
        return onLoading(false)
      }
      if (beatmaps.length === 0) lastPage = true;
      if (page > 0) beatmaps = _.union(prevBeatmaps, beatmaps)
      store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { search, beatmaps: beatmaps || [], max_page, page: page || 0, hideDownloaded, lastPage }})
      onLoading(false)
    })
}

export default askBeatconnect