// this is a working example of esm webpack config
import * as path from 'path';
import url from "url"
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default (env, argv) => {
  return {
      // Reference: https://webpack.js.org/configuration/
      mode: 'development',
      // enhance debugging by adding meta info for the browser devtools
      // source-map most detailed at the expense of build speed.
      devtool: 'source-map',
      // this is for await in index.js
      // Allow to use await on module evaluation (Proposal)
      // Allow to output ESM
      experiments: { topLevelAwait: true, outputModule: true },
      entry: './src/index.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
      devServer: {
        contentBase: './dist/'
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          // use this to make code es5 compatible
          // },
          {
            test: /\.js$/,
            use: ['babel-loader']
          }
        ]
      }
  };
}