const paths = require('./paths');
const webpack = require('webpack');
const getClientEnvironment = require('./env');


module.exports = mode => {
  const env = getClientEnvironment('/');

  return {
    target: "electron-main",
    mode,
    entry: paths.electronIndexJs,
    output: {
      path: paths.appBuild,
      publicPath: paths.publicUrl,
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
          plugins: ["transform-class-properties"]
        }
      },]
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),
    ],
  }
};