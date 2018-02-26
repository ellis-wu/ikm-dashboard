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

export function watchIKMCluster (name) {
  const JSONStream = require('json-stream')
  const jsonStream = new JSONStream()
  var queryString = { watch: true }
  if (name) {
    queryString['fieldSelector'] = 'metadata.name=' + name
  }
  const stream = crd.ns('ikm-system').clusters.getStream({ qs: queryString })
  stream.pipe(jsonStream)
  return jsonStream
}

export function createIKMCluster (basic, clusterSpecs) {
  let bodyJson = {
    apiVersion: 'ikm.io/v1alpha1',
    kind: 'Cluster',
    metadata: {
      name: basic.name,
      namespace: process.env.IKM_NAMESPACE
    },
    spec: {
      type: basic.cluster,
      provisionerSpec: {
        name: basic.provisioner
      },
      selector: {
        matchLabels: {
          'cluster-name': 'k8s-cluster'
        }
      }
    },
    status: {
      state: 'New',
      message: 'New cluster need to setup.'
    }
  }
  if (basic.cluster === 'Kubernetes') {
    bodyJson.spec['kubernetesSpec'] = clusterSpecs
  } else if (basic.cluster === 'Ceph') {
    bodyJson.spec['cephSpec'] = clusterSpecs
  }
  console.log(bodyJson)
  return crd.ns(process.env.IKM_NAMESPACE).clusters.post({ body: bodyJson })
}

export function updateIKMCluster (clusterName, clusterSpecs) {
  return crd.ns(process.env.IKM_NAMESPACE).clusters(clusterName).patch({
    body: {
      spec: {
        kubernetesSpec: clusterSpecs
      }
    },
    headers: { 'content-type': 'application/merge-patch+json' }
  })
}

export function fetchClustersList () {
  return crd.clusters.get()
}

export function fetchCluster (name) {
  return crd.ns(process.env.IKM_NAMESPACE).clusters.get(name)
}

export function fetchDefaults (type) {
  return crd.defaults.get(type)
}
