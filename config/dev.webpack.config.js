/* eslint-disable */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useFileHash: false,
  modules: ['subscriptionInventory'],
  useProxy: true,
  useCache: true,
  appUrl: process.env.BETA
    ? [
        '/beta/insights/subscriptions/inventory',
        '/preview/insights/subscriptions/inventory',
        '/beta/subscriptions/inventory',
        '/preview/subscriptions/inventory'
      ]
    : ['/insights/subscriptions/inventory', '/subscriptions/inventory'],
  env: process.env.BETA ? 'stage-beta' : 'stage-stable',
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    moduleName: 'subscriptionInventory',
    useFileHash: false,
    shared: [
      {
        'react-router-dom': { singleton: true, requiredVersion: '*' }
      }
    ]
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
