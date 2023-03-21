import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: webpackMode,
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].min.js',
  },
  devServer: {
    liveReload: true,
    historyApiFallback: true,
  },
  optimization: {
    minimizer:
      webpackMode === 'production'
        ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ]
        : [],
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify:
        process.env.NODE_ENV === 'production'
          ? {
            collapseWhitespace: true,
            removeComments: true,
          }
          : false,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ],
};
