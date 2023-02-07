#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT_NAME="rhsm-api-proxy"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/cloudservices/subscription-inventory-ui"
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export APP_ROOT=$(pwd)
# export NODE_BUILD_VERSION=15
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
#IQE_PLUGINS="host_inventory"
#IQE_MARKER_EXPRESSION="smoke"
#IQE_FILTER_EXPRESSION=""

set -exv
# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# deploy to ephemeral
# Install bonfire repo/initialize
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
source <(curl -sSL $CICD_URL/bootstrap.sh)

export DEPLOY_FRONTENDS="true"
export APP_NAME="rhsm-api-proxy"

source "${CICD_ROOT}/deploy_ephemeral_env.sh"

# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

# teardown_docker
exit $BUILD_RESULTS
