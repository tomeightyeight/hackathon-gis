const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js?$/,
  //       include: [
  //         path.resolve(__dirname, 'src')
  //       ],
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['es2015']
  //       }
  //     }
  //   ]
  // }
}
