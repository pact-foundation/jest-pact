# Contributing

## Raising issues

Before raising an issue, make sure you have checked the open and closed issues to see if an answer is provided there.
There may also be an answer to your question on [stackoverflow].

Please provide the following information with your issue to enable us to respond as quickly as possible.

- The relevant versions of the packages you are using.
- The steps to recreate your issue.
- An executable code example where possible. You can fork this repository and use one of the [examples] to quickly recreate your issue.

## Contributing features

Hey, that's awesome you want to help! If you have an idea that you think would be great, come and chat to us on [slack] in the `#pact-js` channel.

## Commit messages

`Jest-Pact` uses the [Conventional Changelog](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md)
commit message conventions. Please ensure you follow the guidelines, as they
help us automate our release process.

The release process reads these commits. A breaking change (`feat!`,
or any type with a `!` or a `BREAKING CHANGE:` footer) bumps the
major version. `feat` bumps the minor version. Every other listed
type — `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `revert`,
`chore` — bumps the patch version, since git-cliff bumps the patch
for any conventional commit it does not skip. Only the hidden scopes
bump nothing: a commit that should not appear in the changelog uses
the `deps` scope (`chore(deps)`, `fix(deps)`) or is squashed into one
that should appear.

You can take a look at the git history (`git log`) to get the gist of it.
If you have questions, feel free to reach out in `#pact-js` in our [slack
community](https://pact-foundation.slack.com/).

## Code style and formatting

We use [Biome](https://biomejs.dev/) for formatting and linting, with the
recommended rule set and single quotes. `npm run check:fix` applies the
formatter and safe fixes; `npm run check` is what CI runs. Most editors have
a Biome extension that formats on save.

Type errors are caught by `tsc --noEmit`, which `npm run lint` includes.

## Pull requests

- Write tests for any changes
- Follow existing code style and conventions
- Separate unrelated changes into multiple pull requests
- For bigger changes, make sure you start a discussion first by creating an issue and explaining the intended change

[stackoverflow]: https://stackoverflow.com/questions/tagged/pact
[examples]: https://github.com/YOU54F/jest-pact-typescript/tree/master/examples
[slack]: https://slack.pact.io
