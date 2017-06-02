var path = require('path')

module.exports = require("./make-webpack-config")({
  _special: {
    loaders: {
      'jsx': [ "react-hot-loader", "babel" ]
    },
    separateStylesheets: false,
  },
	devtool: "inline",
  entry: {
    'swagger-ui-bundle': [
      'babel-polyfill',
      './src/core/index.js'
    ],
    'swagger-ui-standalone-preset': [
      './src/standalone/index.js'
    ],
    'swagger-ui-oecloud-preset' : [
      './src/oecloud/index.js'
    ]
  },
  output: {
    pathinfo: true,
    debug: true,
    filename: '[name].js',
    library: "[name]",
    libraryTarget: "umd",
    chunkFilename: "[id].js"
  },
  devServer: {
    port: 3200,
    path: path.join(__dirname, 'dev-helpers'),
    publicPath: "/",
    noInfo: true,
    colors: true,
    hot: true,
    stats: {
      colors: true
    },
  },
})
