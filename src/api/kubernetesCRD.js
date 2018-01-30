const Api = require('kubernetes-client')

// function print (err, result) {
//   console.log(JSON.stringify(err || result, null, 2))
// }

const crd = new Api.CustomResourceDefinitions({
  url: 'https://172.22.132.50:6443',
  version: 'v1alpha1',
  group: 'ikm.io',
  resources: ['clusters', 'defaults'],
  promises: true
})

export function fetchClustersList () {
  return crd.clusters.get()
}

export function fetchCluster (name) {
  return crd.ns('default').clusters.get(name)
}

export function fetchDefaults (type) {
  return crd.defaults.get(type)
}
