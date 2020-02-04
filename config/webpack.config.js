const mainConfig = require('./main.webpack.config') 
const rendererConfig = require('./renderer.webpack.config')

module.exports = target => [mainConfig(target), rendererConfig(target)]