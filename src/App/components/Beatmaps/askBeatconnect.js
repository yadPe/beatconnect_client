import store from '../../../store';

const askBeatconnect = (search, onLoading) => {
  const { query, page, status, mode } = search;
  const prevBeatmaps = store.getState().main.searchResults.beatmaps
  onLoading(true)
  const formatQuery = query.split(' ').join('%20')
  fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&p=${page || 0}&q=${formatQuery}&s=${status || 'ranked'}&m=${mode || 'all'}`)
    .then(res => res.json())
    .then(({ beatmaps, max_page }) => {
      if (page > 0) beatmaps = [...prevBeatmaps, ...beatmaps]
      store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { search, beatmaps, max_page, page: page || 0 }})
      onLoading(false)
    })
}

export default askBeatconnect