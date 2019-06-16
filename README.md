# Jest-Pact

[![npm version](https://badge.fury.io/js/jest-pact.svg)](https://badge.fury.io/js/jest-pact)
![npm](https://img.shields.io/npm/dm/jest-pact.svg)
[![TravisCI](https://travis-ci.org/YOU54F/jest-pact.svg?branch=master)](https://travis-ci.org/YOU54F/jest-pact)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ad6c94892c6704253ca/maintainability)](https://codeclimate.com/github/YOU54F/jest-pact/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/YOU54F/jest-pact/badge.svg)](https://coveralls.io/github/YOU54F/jest-pact)
[![Dependency Status](https://img.shields.io/david/you54f/jest-pact.svg?style=flat-square)](https://david-dm.org/you54f/jest-pact)
[![devDependency Status](https://img.shields.io/david/dev/you54f/jest-pact.svg?style=flat-square)](https://david-dm.org/you54f/jest-pact#info=devDependencies)
[![CircleCI](https://circleci.com/gh/YOU54F/jest-pact.svg?style=svg)](https://circleci.com/gh/YOU54F/jest-pact)

## Jest Adaptor to help write Pact files with ease

### Features

- [x] instantiates the PactOptions for you
- [x] Setups Pact mock service before and after hooks so you don’t have to
- [x] Assign random ports and pass port back to user so we can run in parallel without port clashes

## `Jest-Pact` Roadmap

- [ ] user configurable paths for log/pact output dirs
- [ ] integration with Jest's API to make setup and teardown of pact tests very simple
- [ ] Ensure that jest-pact plays well with jest's default of watch-mode
- [ ] Ensure that pact failures print nice diffs (at the moment you have to go digging in the log files)

## Adapter Installation

```sh
npm i jest-pact --save-dev

OR

yarn add jest-pact --dev
```

## Usage

```js
pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
    // regular pact tests go here
}
```

## Example

Say that your API layer looks something like this:

```js
import axios from 'axios';

const defaultBaseUrl = "http://your-api.example.com"

export const api = (baseUrl = defaultBaseUrl) => ({
     getHealth: () => axios.get(`${baseUrl}/health`)
                    .then(response => response.data.status)
    /* other endpoints here */
})
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
    beforeEach(() =>
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
    // your code recieves the right object.
    //
    // This is often the same as the object that was 
    // in the network response, but (as illustrated 
    // here) not always.
    it('returns server health', () =>
      client.health().then(health => {
        expect(health).toEqual('up');
      }));
  });

```

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
} 
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
      client.health().then(health => {
        expect(health).toEqual('up');
      }));
  });
```


## Configuration

```ts

pactWith(PactOptions, provider => {
    // regular pact tests go here
}

interface PactOptions {
  provider: string;
  consumer: string;
  port?: number; // defaults to a random port if not provided
  pactfileWriteMode?: PactFileWriteMode;
  dir? string // defaults to pact/pacts if not provided
}

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
type PactFileWriteMode = "overwrite" | "update" | "merge";

```

## Defaults

- Log files are written to /pact/logs
- Pact files are written to /pact/pacts


### Jest Watch Mode

By default Jest will watch all your files for changes, which means it will run in an infinite loop as your pact tests will generate json pact files and log files.

You can get round this by using the following `watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]` in your `jest.config.js`

Example

```js
module.exports = {
  testMatch: ["**/*.test.(ts|js)", "**/*.it.(ts|js)", "**/*.pacttest.(ts|js)"],
  watchPathIgnorePatterns: ["pact/logs/*", "pact/pacts/*"]
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
- [Initial Proposal](https://github.com/pact-foundation/pact-js/issues/215#issuecomment-437237669) by [TimothyJones](https://github.com/TimothyJones)
