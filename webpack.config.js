const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: './src/',
  output: {
    library: '',
    libraryTarget: 'commonjs2',
    filename: '',
    path: resolve('dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      { test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
