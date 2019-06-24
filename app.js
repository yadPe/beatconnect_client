const Bot = require('./src/bot');
const fs = require('fs');

let config = null;
try {
  config = JSON.parse(fs.readFileSync('./conf.json'))
  //console.log(config)

} catch (err) {
  console.error('Cannot find config File')
  process.exit();
}

const bot = new Bot(config);
