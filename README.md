# JestPact 

[![npm version](https://badge.fury.io/js/jest-pact.svg)](https://badge.fury.io/js/jest-pact)
[![CircleCI](https://circleci.com/gh/YOU54F/jest-pact.svg?style=svg)](https://circleci.com/gh/YOU54F/jest-pact)

## Jest Adaptor to help write Pact files with ease

Features

- [x] Jest Adaptor For Pact
  - [X] Package for npm
  - [X] Publish to npm
  - [ ] Assign random ports but pass port back to user for thier http agent
- [x] Jest Adaptor For Pact with SuperTest
  - [X] Package for npm
  - [X] Publish to npm
  - [X] Add Supertest typings
  - [ ] Assign random ports
- [ ] user configurable paths
- [ ] use postman-pact to generate postman collections for pact contracts
- [ ] example publish / tagging to pact-broker
- [ ] example verification
- [ ] example can-i-deploy
- [ ] example pact stub service docker templates
- [X] circleci config
- [ ] npm publish automation inc versioning
- [ ] tslint / husky / lint-staged
  
## Installation

```sh
npm i jest-pact --save-dev

OR

yarn add jest-pact --dev
```

## Usage

``` json
pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
    // regular pact tests go here
}
```

with supertest

``` json
pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, (provider, client) => {
    // regular pact tests go here
}
```

## Configuration

``` ts

pactWith({PactOptions}, provider => {
    // regular pact tests go here
}

export interface PactOptions {
  provider: string;
  consumer: string;
  port?: number; // defaults to 8989 if not set
  logLevel?: LogLevel;
}

export declare type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

```

## Output

- Log files are written to /pact/logs
- Pact files are written to /pact/pacts

## Example

You can use this with any http agent for sending your requests.

``` ts
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

``` ts
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
