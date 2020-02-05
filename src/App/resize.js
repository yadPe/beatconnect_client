import _ from 'underscore';
import store from '../shared/store';

export default () =>
  window.addEventListener(
    'resize',
    _.debounce(
      e => store.dispatch({ type: 'RESIZE', payload: { width: e.target.innerWidth, height: e.target.innerHeight } }),
      300,
    ),
  );
