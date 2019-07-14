import Bot from './Bot'
const fs = require('fs');
const config = require('./conf')

export default  () =>  new Bot(config);
