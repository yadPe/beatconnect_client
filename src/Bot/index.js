import Bot from './Bot'
const fs = require('fs');
const config = require('./conf')

export default  () => {
  // let config = null;
  // try {
  //   config = JSON.parse(fs.readFileSync('./conf.json'))
  //   //console.log(config)

  // } catch (err) {
  //   console.error('Cannot find config File')
  //   process.exit();
  // }

  const bot = new Bot(config);
}
