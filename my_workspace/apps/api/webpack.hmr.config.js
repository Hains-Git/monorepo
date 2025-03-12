// const { composePlugins, withNx } = require('@nx/webpack');
// const nodeExternals = require('webpack-node-externals');
// const webpack = require('webpack');

// const skipTypeChecking = false;

// module.exports = composePlugins(withNx({ skipTypeChecking }), (config) => {
//   return {
//     ...config,
//     devtool: 'source-map', // Generate .js and .js.map files
//     output: {
//       path: require('path').resolve(__dirname, '../../dist/apps/api'),
//       filename: 'main.js'
//     },
//     entry: ['webpack/hot/poll?100', ...config.entry.main],
//     externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
//     plugins: [
//       ...config.plugins,
//       new webpack.HotModuleReplacementPlugin(),
//       new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] })
//     ],
//   };
// });

const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

const skipTypeChecking = false;

module.exports = composePlugins(withNx({ skipTypeChecking }), (config) => {
  return {
    ...config,
    devtool: 'source-map', // Keep this for separate source maps
    output: {
      path: path.resolve(__dirname, '../../dist/apps/api'),
      filename: 'main.js',
      // Remove sourceMapFilename to let Webpack handle naming automatically
    },
    entry: ['webpack/hot/poll?100', ...config.entry.main],
    externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.app.json'),
                transpileOnly: false, // Keep full compilation for source maps
                allowTsInNodeModules: true, // Include monorepo libs
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      ...config.resolve,
      modules: [path.resolve(__dirname, '../../libs'), 'node_modules'],
      extensions: ['.ts', '.js'],
    },
    plugins: [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    ],
  };
});