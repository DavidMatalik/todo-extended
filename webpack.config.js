/* 
   Webpack is a module bundler. Webpack's main purpose is to bundle JavaScript files
   for usage in a browser. It helps with managing dependencies. You need to specify 
   an entry point for Webpack (in our project index.js in src folder). Webpack starts 
   with the file specified as entry point and creates a file in which all the needed 
   code is bundled. During this creation process Webpack handles all the imports in
   the way you configured it. Then webpack puts this bundled file at the output place 
   you specified (in our project main.js in dist folder)
*/

// The path module provides utilities for working with file and directory paths.
const path = require('path')

module.exports = {
  devtool: 'source-map',
  // this is for await in index.js
  experiments: { topLevelAwait: true },
  // entry - what files to bundle?
  entry: './src/index.js',
  // output - naming and where to put the bundled files?
  output: {
    filename: 'main.js',
    // path.resolve() - resolve path segments into an absolute path.
    path: path.resolve(__dirname, 'dist')
  },
  // devServer - brings the advantage of live reloading
  devServer: {
    // contentBase - Tell the server where to serve content from.
    contentBase: './dist/'
  },
  // module - Determine how different types of modules should be treated.
  module: {
    // rules - Specify loaders in order to modify how a module is created.
    rules: [
      // allow css files to be imported into js files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // make code es5 compatible
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  }
}
