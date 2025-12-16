const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },

    optimization: {
      minimize: isProduction,
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
      },
    },

    ignoreWarnings: [
      {
        module: /index\.css$/,
        message: /Unable to find uri in 'background-image: url\(\)'/,
      },
    ],

    module: {
      rules: [
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|svg|jpe?g|ico|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: isProduction
              ? 'assets/images/[name].[contenthash][ext]'
              : 'assets/images/[name][ext]',
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: isProduction
              ? 'assets/fonts/[name].[contenthash][ext]'
              : 'assets/fonts/[name][ext]',
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        favicon: './src/assets/images/favicon-32x32.png',
        minify: isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      }),
    ],

    devtool: isProduction ? false : 'inline-source-map',

    devServer: {
      static: './build',
      compress: true,
      port: 9000,
      open: true,
      hot: true,
      historyApiFallback: true,
      watchFiles: ['src/**/*'],
    },
  };
};
