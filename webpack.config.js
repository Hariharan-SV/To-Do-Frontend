const path = require("path");
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  mode: "development",
  entry: "./index.js",
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed) ? JSON.stringify(dotenv.parsed) : process.env
    })
  ],
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "main.js",
  },
  devServer: {
    port: 4000,
    static: path.resolve(__dirname, "./public"),
    hot: true,
    open: true
  },
  resolve: {
    extensions: [".json", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};