# scripts

`release.ts` drives the release process described in
[RELEASING.md](../RELEASING.md). CI runs `prepare` on every push to
`master` and `tag` when the release pull request merges; maintainers run
either with `--dry-run` to preview. `changelog <version>` prints the
release notes for one version.

The directory is an ES module package so Node runs the TypeScript
directly. `npm run lint:tsc` type-checks it through
`tsconfig.scripts.json`; `npm run test:scripts` runs `release.test.ts`
with Node's built-in test runner.
