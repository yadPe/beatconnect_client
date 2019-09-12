import store from "../store";

export default window.addEventListener('resize', (e) => store.dispatch({type: 'RESIZE', payload: {width: e.target.innerWidth, height: e.target.innerHeight}}));