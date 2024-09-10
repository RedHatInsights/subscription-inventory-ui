/* eslint-disable */

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  modules: ['subscriptionInventory']
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config-utilities/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'subscriptionInventory',
    exposes: {
      './RootApp': resolve(__dirname, '../src/AppEntry'),
      './SubscriptionsWidget': resolve(__dirname, '../src/components/Widgets/SubscriptionsWidget')
    },
    shared: [
      {
        'react-router-dom': { singleton: true, requiredVersion: '*', version: '*' }
      }
    ]
  })
);

module.exports = function (env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins
  };
};
