'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_PROTOCOL: '"https"',
  SERVER_HOST: '"127.0.0.1"',
  SERVER_PORT: '"6443"',
  IKM_VERSION: '"v1alpha1"',
  IKM_API_GROUP: '"ikm.io"',
  IKM_NAMESPACE: '"ikm-system"'
})
