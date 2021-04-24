const { join } = require('path')
const { moveSync, emptyDirSync } = require('fs-extra')
const paths = require('../config/paths');
// Copy wallpaper binaries to public folder on build



const sources = [
  '../build/osuIsRunning.bundle.js',
  '../build/osuSongsScan.bundle.js',
]

const destFolder = join(__dirname, '..', 'extraResources');
emptyDirSync(destFolder);

sources.forEach(src => moveSync(join(__dirname,src), join(destFolder, src.split('/').pop())))