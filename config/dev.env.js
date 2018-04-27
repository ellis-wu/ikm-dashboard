'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_PROTOCOL: '"http"',
  SERVER_HOST: '"172.20.3.53"',
  SERVER_PORT: '"8080"',
  IKM_VERSION: '"v1alpha1"',
  IKM_API_GROUP: '"ikm.io"',
  IKM_NAMESPACE: '"ikm-system"'
})
