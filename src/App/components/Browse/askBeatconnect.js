import store from '../../../store';

const askBeatconnect = (query, onLoading, additionalParams) => {
  const { page, status } = additionalParams || {};
  console.log(status)
  onLoading(true)
  const formatQuery = query.split(' ').join('%20')
  fetch(`https://beatconnect.io/api//search/?token=b3z8gl9pzt7iqa89&p=${page || 0}&q=${formatQuery}&s=${status || 'ranked'}`)
    .then(res => res.json())
    .then(({ beatmaps, max_page }) => {
      store.dispatch({ type: 'SEARCH_RESULTS', searchResults: { query, beatmaps, max_page, page } })
      //sendResults(beatmaps)
      onLoading(false)
    })
}

export default askBeatconnect