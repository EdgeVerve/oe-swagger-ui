var path = require("path")


module.exports = require("./make-webpack-config.js")({
  _special: {
    separateStylesheets: false,
    minimize: true,
    sourcemaps: true,
    loaders: {
      "worker.js": ["worker-loader?inline=true&name=[name].js", "babel"]
    }
  },

  entry: {
    "swagger-ui-oecloud-docapp-preset" : [
      "./src/oecloud/docapp/index.js"
    ]
  },

  output:  {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist",
    library: "SwaggerUIOeCloudDocAppPreset",
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "js/[name].js",
  },

})
