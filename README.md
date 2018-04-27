[![Build Status](https://travis-ci.org/inwinstack/ikm-dashboard.svg?branch=master)](https://travis-ci.org/inwinstack/ikm-dashboard) [![codecov](https://codecov.io/gh/inwinstack/ikm-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/inwinstack/ikm-dashboard) [![Greenkeeper badge](https://badges.greenkeeper.io/inwinstack/ikm-dashboard.svg)](https://greenkeeper.io/)
# IKM Dashboard
IKM dashboard is a general purpose, web-based UI for IKM. It allows IT administrator to deploy and manage Kubernetes in the IKM.

## Build and Setup
To build and setup IKM dashboard:
```sh
# install dependencies
npm install

# serve with hot reload at localhost:9090
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit
```

## Build anf Step for Docker

### Quick Start
Pull the docker image:
```sh
$ docker pull elliswu:ikm-dashboard:0.0.1
```

Start the ikm dashboard:
```sh
$ docker run -dit -p 9090:9090 -e API_HOST=127.0.0.1 --name ikm-d elliswu/ikm-dashboard:0.0.1
```

The environment you can set:

| Name          | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| API_PROTOCOL  | Your Kubernetes API Server using HTTPS or HTTP. (default `HTTP`) |
| API_HOST      | Your Kubernetes API Server Host IP Address. (default `127.0.0.1`) |
| API_PORT      | Your Kubernetes API server port number. (default `8080`)          |
| IKM_VERSION   | Your IKM version. (default `v1alpha1`)                            |
| IKM_API_GROUP | Your IKM API group (default `ikm.io`)                             |
| IKM_NAMESPACE | Your IKM namespace (default `ikm-system`)                         |

### How to Build Docker Image
First, clone this repository:
```sh
$ git clone -b dev https://github.com/ellis-wu/ikm-dashboard-docker.git
$ cd ikm-dashboard/
```

Then build the docker image using docker commond:
```sh
$ docker build -t <docker_registry>/ikm-dashboard:0.0.1 .
```
