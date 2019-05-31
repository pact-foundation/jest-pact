# Jest-Pact

[![npm version](https://badge.fury.io/js/jest-pact.svg)](https://badge.fury.io/js/jest-pact)
[![CircleCI](https://circleci.com/gh/YOU54F/jest-pact.svg?style=svg)](https://circleci.com/gh/YOU54F/jest-pact)
[![TravisCI](https://travis-ci.org/YOU54F/jest-pact.svg?branch=master)](https://travis-ci.org/YOU54F/jest-pact)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ad6c94892c6704253ca/maintainability)](https://codeclimate.com/github/YOU54F/jest-pact/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/YOU54F/jest-pact/badge.svg)](https://coveralls.io/github/YOU54F/jest-pact)

## Jest Adaptor to help write Pact files with ease

### Features

- [x] Jest Adaptor For Pact
  - [ ] Assign random ports but pass port back to user for thier http agent
- [x] Jest Adaptor For Pact with SuperTest
  - [x] With added Supertest types
  - [ ] Assign random ports
- [x] use postman-pact to generate postman collections for pact contracts
- [x] example publish / tagging to pact-broker
- [x] example verification
- [x] example pact stub service docker templates
- [x] Now ships with pact and jest as dependencies

## `Jest-Pact` Roadmap

- [ ] Remove supertest and types
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

with supertest

```ts
pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, (provider, client) => {
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
  port?: number; // defaults to 8989 if not set
  pactfileWriteMode?: PactFileWriteMode;
}

export declare type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export declare type PactFileWriteMode = "overwrite" | "update" | "merge";

```

## Output

- Log files are written to /pact/logs
- Pact files are written to /pact/pacts

## Example

You can use this with any http agent for sending your requests.

```ts
pactWith(
  { consumer: "MyConsumer", provider: "pactWith", port: pactPort },
  async (provider: any) => {
    test("should accept a valid get request to get a pet 1", async () => {
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
      const client = getClient(); // getClient calls your own http agent, the function is not shown here
      await client // supertest options shown, other agents may differ
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200);

      await provider.verify();
    });
  }
);
```

## Example with SuperTest

You can use superagent as your http agent, it has a great assertion engine and as we instantiate the pact mock and http agent at the same time, we can assign random ports and take advantage of jests parallel execution.

```ts
pactWithSuperTest(
  { consumer: "MyConsumer", provider: "pactWithSuperTest" },
  async (provider: any, client: any) => {
    test("should accept a valid get request to get a pet", async () => {
      const postValidRequest: InteractionObject = {
        state: "A pet 1 exists",
        uponReceiving: "A get request to get a pet",
        willRespondWith: {
          status: 200
        },
        withRequest: {
          method: "GET",
          path: "/v2/pet/1",
          headers: { api_key: "[]" }
        }
      };

      await provider.addInteraction(postValidRequest);
      await client
        .get("/v2/pet/1")
        .set("api_key", "[]")
        .expect(200);

      await provider.verify();
    });
  }
);
```

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
