const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const getClientEnvironment = require('./env');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = mode => {
  const env = getClientEnvironment('/');

  return {
    target: 'electron-main',
    externals: [
      webpackNodeExternals({
        allowlist: [/webpack(\/.*)?/, 'electron-devtools-installer'],
      }),
    ],
    mode,
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: paths.electronIndexJs,
      osuSongsScan: paths.osuSongsScan,
      osuIsRunning: paths.osuIsRunning,
    },
    output: {
      path: paths.appBuild,
      publicPath: paths.publicUrl,
      filename: '[name].bundle.js',
    },
    node: {
      __dirname: false,
      __filename: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            sourceType: 'unambiguous',
            presets: ['@babel/preset-env'],
          },
        },
        {
          test: /threads.*\.js$/,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              {
                search: './osuSongsScan.worker.js',
                replace: '../../extraResources/osuSongsScan.bundle.js',
              },
              {
                search: './osuIsRunning.worker.js',
                replace: '../../extraResources/osuIsRunning.bundle.js',
              },
            ],
          },
        },
      ],
    },
    plugins: [new webpack.DefinePlugin(env.stringified)],
  };
};
