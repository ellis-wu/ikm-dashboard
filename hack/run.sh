#!/bin/bash

# set kubernetes api server url
API_PROTOCOL=${API_PROTOCOL:-"http"}
API_HOST=${API_HOST:-"127.0.0.1"}
API_PORT=${API_PORT:-"8080"}
IKM_VERSION=${IKM_VERSION:-"v1alpha1"}
IKM_API_GROUP=${IKM_API_GROUP:-"ikm.io"}
IKM_NAMESPACE=${IKM_NAMESPACE:-"ikm-system"}

sed -i s/http/${API_PROTOCOL}/g config/dev.env.js
sed -i s/127.0.0.1/${API_HOST}/g config/dev.env.js
sed -i s/8080/${API_PORT}/g config/dev.env.js
sed -i s/v1alpha1/${IKM_VERSION}/g config/dev.env.js
sed -i s/ikm.io/${IKM_API_GROUP}/g config/dev.env.js
sed -i s/ikm-system/${IKM_NAMESPACE}/g config/dev.env.js

# start ikm dashboard front end
npm run dev
