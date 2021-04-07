const { join } = require('path')
const { ensureDirSync, copySync } = require('fs-extra')
const { copyFileSync } = require('fs');
// Copy wallpaper binaries to public folder on build

const sources = [
  '../src/electron/helpers/wallpaper/assets',
  '../src/electron/helpers/assets',
]

const destFolder = join(__dirname, '..', 'public', 'assets');
ensureDirSync(destFolder);

sources.forEach(src => copySync(join(__dirname, src), destFolder))