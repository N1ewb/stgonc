// webpack.config.js
const { IgnorePlugin } = require('webpack');

module.exports = {
  // Other configurations
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /es6-promise.map/,
    }),
  ],
};
