const Api = require('kubernetes-client')

const crd = new Api.CustomResourceDefinitions({
  url: process.env.SERVER_PROTOCOL + '://' + process.env.SERVER_HOST + ':' + process.env.SERVER_PORT,
  insecureSkipTlsVerify: true,
  // auth: {
  //   bearer: 'your token'
  // },
  version: 'v1alpha1',
  group: 'ikm.io',
  resources: ['clusters', 'defaults'],
  promises: true
})

export function fetchClustersList () {
  return crd.clusters.get()
}

export function fetchCluster (name) {
  return crd.ns(process.env.IKM_NAMESPACE).clusters.get(name)
}

export function fetchDefaults (type) {
  return crd.defaults.get(type)
}
