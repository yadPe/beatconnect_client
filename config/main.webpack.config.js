const paths = require('./paths');
const webpack = require('webpack');
const getClientEnvironment = require('./env');


module.exports = mode => {
  const env = getClientEnvironment('/');

  return {
    target: "electron-main",
    mode,
    entry: {
      main: paths.electronIndexJs,
      osuSongsScan: paths.osuSongsScan,
      osuIsRunning: paths.osuIsRunning
    },
    output: {
      path: paths.appBuild,
      publicPath: paths.publicUrl,
      filename: '[name].bundle.js'
    },
    node: {
      __dirname: false
    },
    module: {
      rules : [{
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          sourceType: 'unambiguous',
          presets: [
              '@babel/preset-env'
          ],
        }
      },
      {
        test: /ipcMessages.js$/,
        loader: 'string-replace-loader',
        options:{
          multiple: [
            {
              search: './processes/osuSongsScan.js',
              replace: './osuSongsScan.bundle.js'
            },
            {
              search: './processes/osuIsRunning.js',
              replace: './osuIsRunning.bundle.js'
            }
          ]
        }
      }]
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),
    ],
  }
};