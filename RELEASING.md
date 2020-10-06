# Releasing

## Publishing via Travis (recommended)

- Update the version number in each `package.json` file to latest version
- Commit

        $ yarn run release
        $ # review workspace and commits - if all looks good...
        $ git push --follow-tags

Travis CI will do the rest.

## How to re-tag if a publish fails

Delete broken tag:

    $ git tag -d "X.Y.Z" && git push origin :refs/tags/X.Y.Z

Now you can re-tag and push as above.

## Publishing manually

Log in to npm.

Run the following commands:

    $ yarn run dist:local
    $ npm prune --production
    $ tar -czvf jestpact.tar.gz package.json index.d.ts index.js v3/index.js v3/index.d.ts LICENSE README.md
    $ yarn run release:dryrun
    $ yarn run release:publish

This should have published the latest version, check to see that at npmjs.com/package/jest-pact.
We now need to create a GitHub release, upload zipped distribution (jestpact.tar.gz) to [GitHub Releases](https://github.com/pact-foundation/jest-pact/releases).
