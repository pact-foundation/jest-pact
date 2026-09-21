#!/bin/bash -eu
set -eu # Have to set explicitly as github's windows runners don't respect the `eu` in the shebang

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd)" # Figure out where the script is running
. "$SCRIPT_DIR"/../lib/robust-bash.sh

require_env_var CI "This script must be run from CI. If you are running locally, note that it stamps your repo git settings."
require_env_var GITHUB_ACTOR
require_env_var GITHUB_OUTPUT

# Setup git for github actions
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git config user.name "${GITHUB_ACTOR}"

npm install

# It's easier to read the release notes
# from the release tool before it runs
RELEASE_NOTES="$(npx commit-and-tag-version --dry-run | awk 'BEGIN { flag=0 } /^---$/ { if (flag == 0) { flag=1 } else { flag=2 }; next } flag == 1')"
# Don't release if there are no changes
if [ "$(echo "$RELEASE_NOTES" | wc -l)" -eq 1 ] ; then
    error "This release would have no release notes. Does it include changes?"
    echo "   - You must have at least one fix / feat commit to generate release notes"
    echo "*** STOPPING RELEASE PROCESS ***"
    exit 1
fi
# Multi-line output uses a heredoc-style delimiter
{
    echo "notes<<RELEASE_NOTES_EOF"
    echo "$RELEASE_NOTES"
    echo "RELEASE_NOTES_EOF"
} >> "$GITHUB_OUTPUT"

npm run dist
npm run release

# Emit version to next step
VERSION="$("$SCRIPT_DIR/lib/get-version.sh")"
echo "version=$VERSION" >> "$GITHUB_OUTPUT"

"$SCRIPT_DIR"/lib/publish.sh

# Push the new commit back to the repo.
git push --follow-tags
