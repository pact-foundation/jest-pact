# Releasing

Releases are cut from a pull request that a bot keeps up to date. Merging
the pull request tags the release; the tag publishes it.

## How a release works

`.github/workflows/release.yml` runs three stages.

### 1. Prepare (every push to `master`)

`node scripts/release.ts prepare` asks git-cliff for the next version
implied by the conventional commits since the last tag, writes it to
`package.json`, prepends the changelog entry to `CHANGELOG.md`, and
force-pushes both to the branch `release/jest-pact`. It then opens a
draft pull request titled `chore(release): jest-pact vX.Y.Z`, or updates
the open one's title and body. Commits that never appear in the
changelog (`chore(deps)` and friends) do not trigger a bump; the job
logs "Nothing to do" and exits.

### 2. Tag (release pull request merged)

`node scripts/release.ts tag` reads `version` from `package.json` on
`master` and pushes the tag `vX.Y.Z`. It exits cleanly if the tag exists,
so the job can be re-run.

### 3. Publish (tag `v*` pushed)

The job runs `npm run dist` (check, test, build, package check),
publishes to npm with provenance through trusted publishing, and creates
the GitHub release with the changelog entry for that version as its
body. If the version is already on the registry the publish step is
skipped and the GitHub release is still created.

## Cutting a release

1. Open the draft pull request on `release/jest-pact`.
2. Review `CHANGELOG.md` and the version in `package.json`. Edit them on
   the branch if the generated result needs changing. The next push to
   `master` force-pushes the branch and discards edits, so make them
   when you are ready to merge.
3. Mark the pull request ready for review and merge it.

## Running the script locally

`git-cliff`, `typos` and `gh` (logged in) must be on your `PATH`.

```sh
node scripts/release.ts prepare --dry-run
```

This writes `package.json` and `CHANGELOG.md` so you can inspect the
result, prints the pull request body, and stops before touching any
branch. Revert with `git checkout -- package.json CHANGELOG.md`.

`node scripts/release.ts tag --dry-run` prints the tag that would be
pushed. `--debug` on either command prints every git and gh invocation.

## One-time setup

- Grant the pact-foundation bot GitHub App access to this repository,
  with the Contents (write) and Pull requests (write) permissions the
  flow needs. The workflow reads `vars.PACT_FOUNDATION_BOT_APP_ID` and
  `secrets.PACT_FOUNDATION_BOT_PRIVATE_KEY`.
- Create the environments `release-pr` (used by the prepare and tag
  jobs) and `npm` (used by the publish job).
- On npmjs.com, under the package's *Publishing access* settings, list a
  trusted publisher for `jest-pact`: repository `pact-foundation/jest-pact`,
  workflow `release.yml`. If the form's optional environment field is
  filled in, it must say `npm`. The publish step requests an OIDC token
  from GitHub and npm verifies it against that entry; no npm token is
  stored. This must be in place before the first release PR is merged:
  otherwise `tag` succeeds and `publish` fails at `npm publish`, leaving
  a tag with nothing on the registry.

## If a stage fails

- **Prepare** failed: fix the cause and push to `master` again, or re-run
  the job.
- **Tag** failed: re-run the job. It creates the tag only if it is
  missing.
- **Publish** failed before `npm publish`: re-run the job.
- **Publish** failed after `npm publish`: re-run the job. The publish
  step sees the version on the registry and skips it; the GitHub release
  step runs again.
- The tag points at the wrong commit: delete the tag locally and on
  `origin`, fix `master`, and re-run the tag job from the merged pull
  request's workflow run, or push the tag by hand with
  `node scripts/release.ts tag`.
