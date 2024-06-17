# Jest-Pact

[![npm version](https://badge.fury.io/js/jest-pact.svg)](https://badge.fury.io/js/jest-pact)
![npm](https://img.shields.io/npm/dm/jest-pact.svg)
[![TravisCI](https://travis-ci.org/pact-foundation/jest-pact.svg?branch=master)](https://travis-ci.org/pact-foundation/jest-pact)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ad6c94892c6704253ca/maintainability)](https://codeclimate.com/github/pact-foundation/jest-pact/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/pact-foundation/jest-pact/badge.svg)](https://coveralls.io/github/pact-foundation/jest-pact)
[![Dependency Status](https://img.shields.io/david/pact-foundation/jest-pact.svg?style=flat-square)](https://david-dm.org/pact-foundation/jest-pact)
[![devDependency Status](https://img.shields.io/david/dev/pact-foundation/jest-pact.svg?style=flat-square)](https://david-dm.org/pact-foundation/jest-pact#info=devDependencies)

## Jest Adaptor to help write Pact files with ease

### Features

- [x] instantiates the PactOptions for you
- [x] Setups Pact mock service before and after hooks so you don’t have to
- [x] Set Jest timeout to 30 seconds preventing brittle tests in slow environments like Docker
- [x] Sensible defaults for the pact options that make sense with Jest
- [x] Supports both the main release of pact-js (9.x.x) and the beta 10.x.x for Pact spec V3

## `Jest-Pact` Roadmap

- [ ] Ensure that jest-pact plays well with jest's default of watch-mode (This has been mothballed, please see this [draft pr](https://github.com/pact-foundation/jest-pact/pull/53) for details. Contributions welcome!
- [ ] Ensure that pact failures print nice diffs (at the moment you have to go digging in the log files)
- [ ] Add a setup hook for clearing out log and pact files

## Adapter Installation

```
npm install --save-dev jest-pact
yarn add jest-pact --dev
```

If you have more than one file with pact tests for the same consumer/provider
pair, you will also need to add `--runInBand` to your `jest` or `react-scripts test` command in your package.json. This avoids race conditions with the mock
server writing to the pact file.

## Usage - Pact-JS V2

Say that your API layer looks something like this:

```js
import axios from 'axios';

const defaultBaseUrl = 'http://your-api.example.com';

export const api = (baseUrl = defaultBaseUrl) => ({
  getHealth: () =>
    axios.get(`${baseUrl}/health`).then((response) => response.data.status),
  /* other endpoints here */
});
```

Then your test might look like:

```js
import { pactWith } from 'jest-pact';
import { Matchers } from '@pact-foundation/pact';
import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  let client;

  beforeEach(() => {
    client = api(provider.mockService.baseUrl)
  });

  describe('health endpoint', () => {
    // Here we set up the interaction that the Pact
    // mock provider will expect.
    //
    // jest-pact takes care of validating and tearing
    // down the provider for you.
    beforeEach(() => // note the implicit return.
                     // addInteraction returns a promise.
                     // If you don't want to implicitly return,
                     // you will need to `await` the result
      provider.addInteraction({
        state: "Server is healthy",
        uponReceiving: 'A request for API health',
        willRespondWith: {
          status: 200,
          body: {
            status: Matchers.like('up'),
          },
        },
        withRequest: {
          method: 'GET',
          path: '/health',
        },
      })
    );

    // You also test that the API returns the correct
    // response to the data layer.
    //
    // Although Pact will ensure that the provider
    // returned the expected object, you need to test that
    // your code receives the right object.
    //
    // This is often the same as the object that was
    // in the network response, but (as illustrated
    // here) not always.
    it('returns server health', () => // implicit return again
      client.getHealth().then(health => {
        expect(health).toEqual('up');
      }));
  });
});
```

## Usage - Pact-JS V3

We also include a wrapper for Pact-JS V3.

**Note: The API is NOT finalised. Feedback welcome**

If you have thoughts or feedback about the DSL, please let us know via slack or open issue.

Currently, only a default for the pact directory is provided by the jest-pact wrapper `jest-pact/dist/v3`.

```js
import { pactWith } from 'jest-pact/dist/v3';
import { MatchersV3 } from '@pact-foundation/pact';
import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, (interaction) => {
  interaction('A request for API health', ({ provider, execute }) => {
    beforeEach(() =>
      provider
        .given('Server is healthy')
        .uponReceiving('A request for API health')
        .withRequest({
          method: 'GET',
          path: '/health',
        })
        .willRespondWith({
          status: 200,
          body: {
            status: MatchersV3.like('up'),
          },
        })
    );

    execute('some api call', (mockserver) =>
      api(mockserver.url)
        .health()
        .then((health) => {
          expect(health).toEqual('up');
        })
    );
  });
});
```

# Best practices

You can make your tests easier to read by extracting your request and responses:

```js
/* pact.fixtures.js */
import { Matchers } from '@pact-foundation/pact';

export const healthRequest = {
  uponReceiving: 'A request for API health',
  withRequest: {
    method: 'GET',
    path: '/health',
  },
};

export const healthyResponse = {
  status: 200,
  body: {
    status: Matchers.like('up'),
  },
};
```

```js
import { pactWith } from 'jest-pact';
import { healthRequest, healthyResponse } from "./pact.fixtures";

import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  let client;

  beforeEach(() => {
    client = api(provider.mockService.baseUrl)
  });

  describe('health endpoint', () => {

    beforeEach(() =>
      provider.addInteraction({
        state: "Server is healthy",
        ...healthRequest,
        willRespondWith: healthyResponse
      })
    );

    it('returns server health', () =>
      client.getHealth().then(health => {
        expect(health).toEqual('up');
      }));
  });
```

## Common gotchas

- Forgetting to wait for the promise from `addInteraction` in `beforeEach`.
  You can return the promise, or use `async`/`await`. If you forget this,
  your interaction may not be set up before the test runs.
- Forgetting to wait for the promise of your API call in `it`. You can
  return the promise, or use `async`/`await`. If you forget this, your
  test may pass before the `expect` assertion runs, causing a potentially
  false success.
- Not running jest with `--runInBand`. If you have multiple test files that
  write to the same contract, you will need this to avoid intermittent failures
  when writing the contract file.
- It's a good idea to specify a different log file for each invocation of `pactWith`,
  otherwise the logs will get overwritten when other specs start. If you provide an
  explicit port, then the default mockserver log filename includes the port number.

# API Documentation

Jest-Pact has two primary functions:

- `pactWith(JestPactOptions, (providerMock) => { /* tests go here */ })`: a wrapper that sets up a pact mock provider, applies sensible default options, and applies the setup and verification hooks so you don't have to
- `messagePactWith(JestMessageConsumerOptions, (messagePact) => { /* tests go here */ })`: a wrapper that sets up a message pact instance and applies sensible default options

Additionally, `pactWith.only / fpactWith`, `pactWith.skip / xpactWith`, `messagePactWith.only / fmessagePactWith` and `messagePactWith.skip / xmessagePactWith` behave as you would expect from Jest.

There are two types exported:

- `JestProvidedPactFn`: This is the type of the second argument to `pactWith`, ie: `(provider: Pact) => void`
- `JestPactOptions`: An extended version of `PactOptions` that has some additional convienience options (see below).

## Configuration

You can use all the usual `PactOptions` from pact-js, plus a timeout for
telling jest to wait a bit longer for pact to start and run.

```ts
pactWith(JestPactOptions, (provider) => {
  // regular http pact tests go here
});
messagePactWith(JestMessageConsumerOptions, (messagePact) => {
  // regular message pact tests go here
});

interface ExtraOptions {
  timeout?: number; // Timeout for pact service start/teardown, expressed in milliseconds
  // Default is 30000 milliseconds (30 seconds).
  logDir?: string; // path for the log file
  logFileName?: string; // filename for the log file
}

type JestPactOptions = PactOptions & ExtraOptions;

type JestMessageConsumerOptions = MessageConsumerOptions & ExtraOptions;
```

### Defaults

Jest-Pact sets some helpful default PactOptions for you. You can override any of these by explicitly setting corresponding option. Here are the defaults:

- `log` is set so that log files are written to `/pact/logs`, and named `<consumer>-<provider>-mockserver-interaction.log`. If you provided an explicit `port`, then the log file name is `<consumer>-<provider>-mockserver-interaction-port-<portNumber>.log`
- `dir` is set so that pact files are written to `/pact/pacts`
- `logLevel` is set to warn
- `timeout` is 30,000 milliseconds (30 seconds)
- `pactfileWriteMode` is set to "update"

Most of the time you won't need to change these.

A common use case for `log` is to change only the filename or the path for
logging. To help with this, Jest-Pact provides convenience options `logDir`
and `logFileName`. These allow you to set the path or the filename
independently. In case you're wondering, if you specify `log`, `logDir` and
`logFileName`, the convenience options are ignored and `log` takes
precedence.

### Jest Watch Mode

By default Jest will watch all your files for changes, which means it will run in an infinite loop as your pact tests will generate json pact files and log files.

You can get around this by using the following `watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]` in your `jest.config.js`

Example

```js
module.exports = {
  testMatch: ['**/*.test.(ts|js)', '**/*.it.(ts|js)', '**/*.pacttest.(ts|js)'],
  watchPathIgnorePatterns: ['pact/logs/*', 'pact/pacts/*'],
};
```

You can now run your tests with `jest --watch` and when you change a pact file, or your source code, your pact tests will run

### Examples of usage of `jest-pact`

See [Jest-Pact-Typescript](https://github.com/YOU54F/jest-pact-typescript) which showcases a full consumer workflow written in Typescript with Jest, using this adaptor

- [x] Example pact tests
  - [x] AWS v4 Signed API Gateway Provider
  - [x] Soap API provider
  - [x] File upload API provider
  - [x] JSON API provider

#### Examples Installation

- clone repository `git@github.com:YOU54F/jest-pact-typescript.git`
- Run `yarn install`
- Run `yarn run pact-test`

Generated pacts will be output in `pact/pacts`
Log files will be output in `pact/logs`

## Credits

- [Pact Foundation](https://github.com/pact-foundation)
- [Pact JS](https://github.com/pact-foundation/pact-js)
- [Initial Proposal](https://github.com/pact-foundation/pact-js/issues/215#issuecomment-437237669)
