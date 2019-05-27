# Pact-Verification

## Usage - Pact Verification

Pact verification is triggered by calling this repo's circleCI workflow via CircleCI's API. We can pass in parameters that will be picked up and injected into our script at run time via `env` params.

It is required, that the following values are set in a curl request

``` sh
PACT_PROVIDER_NAME=
PACT_PROVIDER_URL=
PACT_CONSUMER_TAG=
```

The following values are stored in CircleCI environment parameters.

``` sh
PACT_BROKER_URL=
PACT_BROKER_BASIC_AUTH_USERNAME=
PACT_BROKER_BASIC_AUTH_PASSWORD=
PACT_PUBLISH_VERIFICATION=true
```

A sample curl request

``` curl
curl -u $CIRCLE_TOKEN: -X POST \
  --header "Content-Type: application/json" \
  -d '{"build_parameters":{
    "PACT_PROVIDER_NAME":"test-service",
    "PACT_PROVIDER_URL":"https://provider_url",
    "PACT_CONSUMER_TAG":"feat/foo-123"
    }}' \
  https://circleci.com/api/v1.1/project/github/you54f/jest-pact-provider/tree/master
```

Install via yarn install

``` sh
yarn install
```

Run pact verification by reading pacts from the pact broker

``` sh
yarn run pact-verify
```

Web hooks are setup to perform the following actions

``` sh
on contract_content_changed - trigger slack alert
on contract_content_changed - trigger provider verification build for the change changed consumer/provider paid.
on provider_verification_published - trigger slack alert
```

Webhooks for CircleCI in the pact-broker, use dynamic variable substition to set values
[Dynamic Variable Substitution](https://github.com/pact-foundation/pact_broker/blob/master/lib/pact_broker/doc/views/webhooks.markdown#dynamic-variable-substitution)

Slack Alerts on contract content change

``` json
{
  "request": {
    "method": "POST",
    "url": "INSERT YOUR SLACK WEBHOOK HERE",
    "body": {
      "channel": "#pact-alerts",
      "text": "A new pact contract has been created for \n Consumer: ${pactbroker.consumerName}/${pactbroker.consumerVersionNumber} on branch ${pactbroker.consumerVersionTags} \n Provider: ${pactbroker.providerName} \n Pact content can be viewed <${pactbroker.pactUrl}|here>"
    }
  },
      "events": [
        {
            "name": "contract_content_changed"
        }
    ],
    "provider": {
      "name": "REPLACE_ME_WITH_NAME_OF_SERVICE"
    }
}
```

CircleCI Triggers on contract content change

``` json
{
  "events": [
    {
      "name": "contract_content_changed"
    }
  ],
  "provider": {
    "name": "REPLACE_ME_WITH_NAME_OF_SERVICE"
  },
  "request": {
    "method": "POST",
    "url": "https://circleci.com/api/v1.1/project/github/you54f/pact-consumer-example-typescript/tree/FOO-123?circle-token=****",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {"build_parameters":{
      "PACT_PROVIDER_NAME":"${pactbroker.providerName}",
      "PACT_PROVIDER_URL":"REPLACE_ME_WITH_PROVIDER_BASE_URL",
      "PACT_PROVIDER_VERSION":"${pactbroker.providerVersionNumber}",
      "PACT_CONSUMER_TAG":"${pactbroker.consumerVersionTags}"
      }}
  }
}
```

Slack Alerts on provider verification

``` json
{
  "request": {
    "method": "POST",
    "url": "INSERT YOUR SLACK WEBHOOK HERE",
    "body": {
      "channel": "#pact-alerts", 
      "text": "Pact Provider verification has been run for ${pactbroker.providerName}/${pactbroker.providerVersionTags}. \n Status: <${pactbroker.verificationResultUrl}|${pactbroker.githubVerificationStatus}> \n Pact Contract is available <${pactbroker.pactUrl}|here>"
    }
  },
      "events": [
        {
            "name": "provider_verification_published"
        }
    ],
    "provider": {
      "name": "REPLACE_ME_WITH_NAME_OF_SERVICE"
    }
}
```

## Compatibility

The codebase was written using `node v8.15.0`