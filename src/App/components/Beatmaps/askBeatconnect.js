import store from '../../../store';

const askBeatconnect = (search, onLoading) => {
  const { query, page, status, mode } = search;
  onLoading(true)
  const formatQuery = query.split(' ').join('%20')
  fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&p=${page || 0}&q=${formatQuery}&s=${status || 'ranked'}&m=${mode || 'all'}`)
    .then(res => res.json())
    .then(({ beatmaps, max_page }) => {
      store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { search, beatmaps, max_page, page }})
      onLoading(false)
    })
}

export default askBeatconnect