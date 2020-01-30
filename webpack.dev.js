const merge = require('webpack-merge');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    port: 3002,
    inline: true,
    open: true,
    openPage: './'
  },
});