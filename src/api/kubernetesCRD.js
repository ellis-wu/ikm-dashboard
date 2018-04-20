const Api = require('kubernetes-client')

const crd = new Api.CustomResourceDefinitions({
  url: process.env.SERVER_PROTOCOL + '://' + process.env.SERVER_HOST + ':' + process.env.SERVER_PORT,
  insecureSkipTlsVerify: true,
  // auth: {
  //   bearer: 'your token'
  // },
  version: 'v1alpha1',
  group: 'ikm.io',
  resources: ['clusters', 'defaults', 'agents'],
  promises: true
})

export function watchIKMCluster (name) {
  var queryString = { watch: true }
  if (name) {
    queryString['fieldSelector'] = 'metadata.name=' + name
  }
  return crd.ns(process.env.IKM_NAMESPACE).clusters.getStream({ qs: queryString })
}

export function watchIKMAgent (name) {
  var queryString = { watch: true }
  if (name) {
    queryString['fieldSelector'] = 'metadata.name=' + name
  }
  return crd.ns(process.env.IKM_NAMESPACE).agents.getStream({ qs: queryString })
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
        type: basic.provisioner
      }
    }
  }
  switch (basic.cluster) {
    case 'Kubernetes':
      bodyJson.spec['kubernetesSpec'] = clusterSpecs
      break
    case 'Ceph':
      bodyJson.spec['cephSpec'] = clusterSpecs
      break
  }
  return crd.ns(process.env.IKM_NAMESPACE).clusters.post({ body: bodyJson })
}

export function updateIKMCluster (clusterName, clusterSpecs) {
  var patchJson = {
    body: {
      spec: clusterSpecs
    },
    headers: { 'content-type': 'application/merge-patch+json' }
  }
  return crd.ns(process.env.IKM_NAMESPACE).clusters(clusterName).patch(patchJson)
}

export function updateIKMAgentRole (clusterName, agentName, agentRoles) {
  clusterName = (agentRoles.length) ? clusterName : ''
  let patchJson = {
    body: {
      metadata: {
        labels: {
          'cluster-name': clusterName
        }
      },
      spec: {
        roles: agentRoles
      }
    },
    headers: { 'content-type': 'application/merge-patch+json' }
  }
  return crd.ns(process.env.IKM_NAMESPACE).agents(agentName).patch(patchJson)
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

export function fetchAgents (name) {
  return crd.ns(process.env.IKM_NAMESPACE).agents.get(name)
}
