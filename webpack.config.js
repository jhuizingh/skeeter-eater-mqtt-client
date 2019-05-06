const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    //entry: './assets/src/index.js'
    entry: './client/index.js'
  },
  output: {
    path: __dirname + '/.tmp/public',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    port: 8081,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ]
};
