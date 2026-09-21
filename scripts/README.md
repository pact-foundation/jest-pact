# scripts

`release.ts` drives the release process described in
[RELEASING.md](../RELEASING.md). CI runs `prepare` on every push to
`master` and `tag` when the release pull request merges; maintainers run
either with `--dry-run` to preview. `changelog <version>` prints the
release notes for one version.

The directory is an ES module package so Node runs the TypeScript
directly, through Node's type stripping. That needs Node 22.18 or
later, or Node 24; `package.json`'s `engines` floor of 22 describes
the library, not the scripts. Running the scripts, and therefore
`npm run dist`, needs that higher floor. `npm run lint:tsc`
type-checks the directory through `tsconfig.scripts.json`; `npm run
test:scripts` runs `release.test.ts` with Node's built-in test
runner.
