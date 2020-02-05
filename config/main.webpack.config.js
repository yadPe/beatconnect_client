const path = require("path");
const paths = require('./paths');

module.exports = (target) => ({
  mode: target,
  entry: paths.electronIndexJs,
  output: {
    path: paths.appBuild,
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
  target: "electron-main"
});