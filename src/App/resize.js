import _ from 'underscore';
import store from '../store';

export default window.addEventListener(
  'resize',
  _.debounce(
    e => store.dispatch({ type: 'RESIZE', payload: { width: e.target.innerWidth, height: e.target.innerHeight } }),
    300,
  ),
);
