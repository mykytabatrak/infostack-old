/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      'infostack-shared': path.resolve(
        path.join(__dirname, '/../shared/build'),
      ),
    },
  },
  watchFolders: [
    path.resolve(__dirname, './node_modules'),
    path.resolve(path.join(__dirname, '/../shared/build')),
  ],
};
