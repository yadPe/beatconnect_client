const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs');
// Edits the wallpaper node module before we build the app to fix resolving issue of binaries in the asar package

const win = join(__dirname, '..', 'node_modules/wallpaper/source/win.js');
const macos = join(__dirname, '..', 'node_modules/wallpaper/source/macos.js');
const sources = [win, macos]

sources.forEach(source => {
  const file = readFileSync(source, { encoding: 'utf8' });
  const platform = source.split('/').pop().split('.').shift();
  console.log(`===========> ${platform} -> Replacing wallpaper binaries path`)
  const binaries = {
    win: 'win-wallpaper.exe',
    macos: 'macos-wallpaper'
  }
  const newFile = file.replace(`const binary = path.join(__dirname, '${binaries[platform]}')`, `const binary = path.join(__dirname, '${binaries[platform]}').replace('app.asar/build', 'app.asar.unpacked/node_modules/wallpaper/source/')`)
  writeFileSync(source, newFile, {encoding: 'utf8'})
})