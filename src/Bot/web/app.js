const Bot = require('../Bot');
const fs = require('fs');
document.getElementById('go').addEventListener('click', () => go());

const go = () => {
  let config = null;
  try {
    config = JSON.parse(fs.readFileSync('./conf.json'));
    //console.log(config)
  } catch (err) {
    console.error('Cannot find config File');
    process.exit();
  }

  const bot = new Bot(config);
};
