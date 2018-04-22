const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");


/*
TAKE INTO ACCOUNT OFLLOWING POINTS:
NODE_ENV=production runs UglifyJSPlugin behind the scene

Sepearate hnadler files

*/

/*
TODO: checkout SplitChunksPlugin, and other possible ways to reduce node_module size as well as bundle size
*/
module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  devtool: 'source-map',
  externals: [nodeExternals()],
  // webpack automatically minifies the bundle file, when NODE_ENV=production
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  // webpack recommends error option  to help prevent deploying production bundles that are too large, impacting webpage performance.
  performance: {
    hints: 'error'
  },
  stats: 'normal',
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        "presets": [
          ["env", {
            "targets": {
              "node": "8.10"
            }
          }]
        ]
      }
    }]
  }
};
