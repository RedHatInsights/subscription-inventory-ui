/* eslint-disable */

const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  modules: ['subscriptionInventory'],
  ...(process.env.BETA && { deployment: 'beta/apps' }),
  routes: {
    ...(process.env.CONFIG_PORT && {
      '/api/chrome-service/v1/static': {
        host: `http://localhost:${process.env.CONFIG_PORT}`
      },
      '/api/chrome-service/v1/dashboard-templates': {
        host: `http://localhost:${process.env.CONFIG_PORT}`
      }
    })
  }
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'subscriptionInventory',
    exposes: {
      './RootApp': resolve(__dirname, '../src/AppEntry'),
      './SubscriptionsWidget': resolve(__dirname, '../src/components/Widgets/SubscriptionsWidget')
    },
    shared: [
      {
        'react-router-dom': { singleton: true, requiredVersion: '*' }
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
