import Bot from './Bot'
import store from '../store';

export default  () =>  new Bot(store.getState().settings);
