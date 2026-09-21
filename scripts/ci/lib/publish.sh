#!/bin/bash -eu
set -eu # Have to set explicitly as github's windows runners don't respect the `eu` in the shebang

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd)" # Figure out where the script is running
. "$SCRIPT_DIR"/../../lib/robust-bash.sh

require_binary npm

VERSION="$("$SCRIPT_DIR/get-version.sh")"

echo "--> Releasing version ${VERSION}"

echo "--> Releasing artifacts"
echo "    Publishing jest-pact@${VERSION}..."
# Authentication comes from the workflow's OIDC token (npm trusted publishing)
npm publish --tag latest --provenance
echo "    done!"
