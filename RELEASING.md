# Releasing

We've moved to GitHub Actions for releases.

- Update the version number in each `package.json` file to latest version
- Commit

Releases trigger when the repository recieves the custom repository_dispatch event
`release-triggered`.

This triggers the `publish.yml` workflow, which in turn
triggers the `release.sh` script in `scripts/ci`.
The workflow will also create a github release with an appropriate changelog.

Having the release triggered by a custom event is useful for automating
releases in the future (eg for version bumps in pact dependencies).

### Release.sh

This script is not intended to be run locally. Note that it modifies your git
settings.

The script will:

- Modify git authorship settings
- Confirm that there would be changes in the changelog after release
- Run Lint
- Run Build
- Run Test
- Commit an appropriate version bump, changelog and tag
- Package and publish to npm
- Push the new commit and tag back to the main branch.

Should you need to modify the script locally, you will find it uses some
dependencies in `scripts/ci/lib`.