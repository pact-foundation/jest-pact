# Jest-Pact

[![npm version](https://badge.fury.io/js/jest-pact.svg)](https://badge.fury.io/js/jest-pact)
[![CircleCI](https://circleci.com/gh/YOU54F/jest-pact.svg?style=svg)](https://circleci.com/gh/YOU54F/jest-pact)

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

- [ ] user configurable paths for log/pact output dirs
- [ ] code coverage to coveralls
- [ ] npm publish automation inc versioning
• integration with Jest's API to make setup and teardown of pact tests very simple
• Ensure that jest-pact plays well with jest's default of watch-mode
• Ensure that pact failures print nice diffs (at the moment you have to go digging in the log files)

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

### Examples of usage of `jest-pact` in this repository

See `src/examples`

- [x] Example pact tests
  - [x] AWS v4 Signed API Gateway Provider
  - [x] Soap API provider
  - [x] File upload API provider
  - [x] JSON API provider

Run them by cloning the repostory and `yarn run install && yarn run pact-test`

Generated pacts will be output in `pact/pacts`
Log files will be output in `pact/logs`


### Other Pact related items in this repository, but otherwise unrelated to jest-pact directly

A Full Consumer side Pact development workflow example

- Written in Typescript
- Utilises Pact in a Jest Wrapper [jest-pact](https://github.com/YOU54F/jest-pact)
- Uses Swagger to define API
- Uses Swagger-cli to validate Swagger specification
- Uses Pact.io to perform consumer driven contract tests
- Uses Swagger-mock-validator to validate generated pact contracts
- Publishes validated pact contracts to pact-broker (hosted on AWS Lambda)
- Tags validated contracts with branch name
- Pact mock services with Docker
- Wiremock services with Docker
- Verification against AWS v4 signed API Gateway endpoints
- Create postman collections from pacts

- [x] Pact mock service docker base
- [x] Pact mock service docker base examples
- [x] Postman integration
  - [x] Generate postman collections from pact contracts
  - [x] Inject URL into postman collection from `PACT_PROVIDER_URL`
  - [x] Run postman scripts with newman
  - [x] Run postman scripts with jest
- [ ] example can-i-deploy
  
## Where can I see it

- CircleCI builds here - <https://circleci.com/gh/YOU54F/jest-pact>
- Pact Broker here - <https://you54f.co.uk> - running on AWS Lambda (see https://github.com/YOU54F/pact_broker-serverless for details of setup)

## Examples Installation

- clone repository
- Run `yarn install`

### Run pact tests

- Run `yarn run pact-test`

### Validate Swagger spec

- Run `yarn run swagger-validate-spec`

### Validate Pact contract against Swagger spec

- Run `yarn run swagger-validate-pact`

### Publish pacts

- Run `pact-publish`

### Tag pacts

- Run `pact-tag`

### Start the mock server

- Run `docker-compose up`

### Set the following env vars for pact publishing

- PACT_BROKER_URL
- PACT_BROKER_BASIC_AUTH_USERNAME
- PACT_BROKER_BASIC_AUTH_PASSWORD

### Create postman collections from pacts

- run `./postman/postman-pact.sh` to generate postman collections in `pact/postman/collections`
- run `./postman/postman-replace-urls.sh` to generate env configs for postman in `pact/postman/env` where the urls are replaced with `$PACT_PROVIDER_URL`
- run `./postman//postman-newman.sj` to run the postman collection against your `$PACT_PROVIDER_URL`
- run newman tests with jest, via `npx jest -c jest.newman.js`

Note:- There are no tests in the saved postman collections, so it will run the requests, but will not validate the responses are as per the pacts.

TODO

- [ ] Currently this will use `$PACT_PROVIDER_URL` for all generated postman collections, add the ability to specify a provider name, and update the url accordingly.

## Build your own Pact Stub Service for your pacts in Docker

`cd docker/pact-stub-service`

Build the base pact image, change the name `you54f` to your own dockerhub username

The Base image resides at `base.Dockerfile` which will load the pact ruby standalone, plus a healthcheck endpoint `/healthcheck` on the containers for use in AWS and other Cloud providers.

`make pact_build`
docker build -t pact-base -f base.Dockerfile .
`make pact_tag`
docker tag pact-base you54f/pact-base
`make pact_push`
docker push you54f/pact-base

You can then copy your pact files generated with `yarn run test` into the `docker/pact-stub-service/pacts` folder that the `Dockerfile` will use.

`copy_pacts`
rm -rf pacts && cp -r ../../pact/pacts .

Look at the `Dockerfile`

```Dockerfile
FROM you54f/pact-base

ARG PACT_FILE

COPY ${PACT_FILE} /pact.json
```

See the `docker/docker-compose.yml` file for how to load your pacts into the docker container.

```yaml
version: "3.1"

services:
  pact-stub-server-json:
    build:
      context: pact-stub-service
      args:
        PACT_FILE: pacts/test-consumer-json-provider.json
    ports:
      - "8080:8080"
```

You can run it with `cd docker && docker-compose up`

## Credits

- [Pact Foundation](https://github.com/pact-foundation)
- [Pact JS](https://github.com/pact-foundation/pact-js)
- [Initial Proposal](https://github.com/pact-foundation/pact-js/issues/215#issuecomment-437237669) by [TimothyJones](https://github.com/TimothyJones)
