const { join } = require('path')
const { copyFileSync } = require('fs');
// Copy wallpaper binaries to public folder on build

const sources = [
  '../src/electron/helpers/wallpaper/win-wallpaper.exe',
  '../src/electron/helpers/wallpaper/macos-wallpaper'
]

const destFolder = join(__dirname, '..', 'public');

sources.forEach(src => copyFileSync(join(__dirname, src), join(destFolder, src.split('/').pop())))