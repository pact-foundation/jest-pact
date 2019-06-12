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

```ts
pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
    // regular pact tests go here
}
```

## Configuration

```ts

pactWith({PactOptions}, provider => {
    // regular pact tests go here
}

export interface PactOptions {
  provider: string;
  consumer: string;
  port?: number; // defaults to a random port if not provided
  pactfileWriteMode?: PactFileWriteMode;
  dir? string // defaults to pact/pacts if not provided
}

export declare type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export declare type PactFileWriteMode = "overwrite" | "update" | "merge";

```

## Output

- Log files are written to /pact/logs
- Pact files are written to /pact/pacts

## Example

A contrived example using supertest as a client

```ts
import {InteractionObject} from "@pact-foundation/pact"
import * as jestpact from "jest-pact";
import * as supertest from "supertest";

jestpact.pactWith(
  { consumer: "test-consumer", provider: "json-provider" },
  async (provider: any) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return supertest(url);
    };
    test("should accept a valid get request to get a pet", async () => {
      const postValidRequest: InteractionObject = {
        state: "A pet 1845563262948980200 exists",
        uponReceiving: "A get request to get a pet",
        willRespondWith: {
          status: 200
        },
        withRequest: {
          method: "GET",
          path: "/v2/pet/1845563262948980200",
          headers: { api_key: "[]" }
        }
      };
      await provider.addInteraction(postValidRequest);

      await client()
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200);
      await provider.verify();
    });
  }
);

```

To use Pact to it's full effect, you should replace the client above with your API call in your code and instantiate with pact mock service base url `provider.mockService.baseUrl`

So if your calling method is

```ts
export const api = (baseURl) => ({ 
     getUser: () => axios(opts).then(processResponse)
})
```

Then your test may look like

```ts
import {InteractionObject} from "@pact-foundation/pact"
import * as jestpact from "jest-pact";
import {api} from "yourCode";

jestpact.pactWith(
  { consumer: "test-consumer", provider: "json-provider" },
  async (provider: any) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return api(url);
    };
    test("should accept a valid get request to get a pet", async () => {
      const postValidRequest: InteractionObject = {
        state: "A pet 1845563262948980200 exists",
        uponReceiving: "A get request to get a pet",
        willRespondWith: {
          status: 200
        },
        withRequest: {
          method: "GET",
          path: "/v2/pet/1845563262948980200",
          headers: { api_key: "[]" }
        }
      };
      await provider.addInteraction(postValidRequest);

      await client()
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200);
      await provider.verify();
    });
  }
);

```

You can make your test shorter, by moving your interaction object into another file

```ts
import * as jestpact from "jest-pact";
import * as supertest from "supertest";
import * as interaction from "./expectation/json.expectation";
import * as json from "./requestResponse/json.reqRes";

jestpact.pactWith(
  { consumer: "test-consumer", provider: "json-provider" },
  async (provider: any) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return supertest(url);
    };
    test("should accept a valid get request to get a pet", async () => {
      await provider.addInteraction(interaction.postValidRequest);

      await client()
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200, json.getPetValidResponse);
      await provider.verify();
    });
  }
);

```

### Jest Watch Mode

By default Jest will watch all your files for changes, which means it will run in an infinite loop as your pact tests will generate json pact files and log files.

You can get round this by using the following `watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]` in your `jest.config.js` 

Example

```js
module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/*.test.(ts|js)", "**/*.it.(ts|js)", "**/*.pacttest.(ts|js)"],
  testEnvironment: "node",
  reporters: ["default", "jest-junit"],
  watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]
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
