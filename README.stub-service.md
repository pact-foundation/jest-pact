# A minimal Docker image to contain the Pact-Standalone executable

``` Dockerfile
  FROM debian:stretch-20181226
  CMD ["bash"]
  ARG PACT_RUBY_VERSION=1.64.0
  WORKDIR /pact-ruby
  RUN PACT_RUBY_VERSION=1.63.0 apt-get update \
  && apt-get install -y curl \
  && curl -L -O https://github.com/pact-foundation/pact-ruby-standalone/releases/download/v${PACT_RUBY_VERSION}/pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz \
  && tar -xf pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz \
  && rm pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz && rm -rf /var/lib/apt/lists/*
  ENV PATH=/pact-ruby/pact/bin/:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
  EXPOSE 8080
  EXPOSE 8181
```

The ARG `PACT_RUBY_VERSION` should be set to the particular version of pact standalone, that you wish to install.

[Pact Standalone v1.64.0](https://github.com/pact-foundation/pact-ruby-standalone/releases/tag/v1.64.0)

# Pact standalone executables

This package contains the Ruby implementations of the Pact Mock Service, Pact Provider Verifier and Pact Broker Client, packaged with Travelling Ruby so that they can be run from the command line without a Ruby installation.

## Package contents

This version (1.64.0) of the Pact standalone executables package contains:

* pact gem 1.38.0
* pact-mock_service gem 2.12.0
* pact-support gem 1.9.0
* pact-provider-verifier gem 1.22.0
* pact_broker-client gem 1.18.0
* pact-message gem 0.5.0

## Docker execution

```
docker run -it pact-base-docker <pact_standalone_command>
```
eg
```
docker run -it pact-base-docker pact-mock-service
```

## Usage

<a name="pact-mock-service"></a>
### pact-mock-service

```
Commands:
  pact-mock-service control               # Run a Pact mock service control s...
  pact-mock-service control-restart       # Start a Pact mock service control...
  pact-mock-service control-start         # Start a Pact mock service control...
  pact-mock-service control-stop          # Stop a Pact mock service control ...
  pact-mock-service help [COMMAND]        # Describe available commands or on...
  pact-mock-service restart               # Start or restart a mock service. ...
  pact-mock-service service               # Start a mock service. If the cons...
  pact-mock-service start                 # Start a mock service. If the cons...
  pact-mock-service stop -p, --port=PORT  # Stop a Pact mock service
  pact-mock-service version               # Show the pact-mock-service gem ve...

Usage:
  pact-mock-service service

Options:
      [--consumer=CONSUMER]                                      # Consumer name
      [--provider=PROVIDER]                                      # Provider name
  -p, [--port=PORT]                                              # Port on which to run the service
  -h, [--host=HOST]                                              # Host on which to bind the service
                                                                 # Default: localhost
  -d, [--pact-dir=PACT_DIR]                                      # Directory to which the pacts will be written
  -m, [--pact-file-write-mode=PACT_FILE_WRITE_MODE]              # `overwrite` or `merge`. Use `merge` when running multiple mock service instances in parallel for the same consumer/provider pair. Ensure the pact file is deleted before running tests when using this option so that interactions deleted from the code are not maintained in the file.
                                                                 # Default: overwrite
  -i, [--pact-specification-version=PACT_SPECIFICATION_VERSION]  # The pact specification version to use when writing the pact. Note that only versions 1 and 2 are currently supported.
                                                                 # Default: 2
  -l, [--log=LOG]                                                # File to which to log output
      [--log-level=LOG_LEVEL]                                    # Log level. Options are DEBUG INFO WARN ERROR
                                                                 # Default: DEBUG
  -o, [--cors=CORS]                                              # Support browser security in tests by responding to OPTIONS requests and adding CORS headers to mocked responses
      [--ssl], [--no-ssl]                                        # Use a self-signed SSL cert to run the service over HTTPS
      [--sslcert=SSLCERT]                                        # Specify the path to the SSL cert to use when running the service over HTTPS
      [--sslkey=SSLKEY]                                          # Specify the path to the SSL key to use when running the service over HTTPS

Start a mock service. If the consumer, provider and pact-dir options are provided, the pact will be written automatically on shutdown (INT).

```

<a name="pact-stub-service"></a>
### pact-stub-service

```
Usage:
  pact-stub-service PACT_URI ...

Options:
  -p, [--port=PORT]        # Port on which to run the service
  -h, [--host=HOST]        # Host on which to bind the service
                           # Default: localhost
  -l, [--log=LOG]          # File to which to log output
  -o, [--cors=CORS]        # Support browser security in tests by responding to OPTIONS requests and adding CORS headers to mocked responses
      [--ssl], [--no-ssl]  # Use a self-signed SSL cert to run the service over HTTPS
      [--sslcert=SSLCERT]  # Specify the path to the SSL cert to use when running the service over HTTPS
      [--sslkey=SSLKEY]    # Specify the path to the SSL key to use when running the service over HTTPS

Description:
  Start a stub service with the given pact file(s) or directories. Pact URIs may be
  local file or directory paths, or HTTP. Include any basic auth details in the
  URL using the format https://USERNAME:PASSWORD@URI. Where multiple matching
  interactions are found, the interactions will be sorted by response status,
  and the first one will be returned. This may lead to some non-deterministic
  behaviour. If you are having problems with this, please raise it on the
  pact-dev google group, and we can discuss some potential enhancements. Note
  that only versions 1 and 2 of the pact specification are currently fully
  supported. Pacts using the v3 format may be used, however, any matching
  features added in v3 will currently be ignored.
```

<a name="pact-provider-verifier"></a>
### pact-provider-verifier

To connect to a Pact Broker that uses custom SSL cerificates, set the environment variable `$SSL_CERT_FILE` or `$SSL_CERT_DIR` to a path that contains the appropriate certificate.

```
Usage:
  pact-provider-verifier PACT_URL ... -h, --provider-base-url=PROVIDER_BASE_URL

Options:
  -h, --provider-base-url=PROVIDER_BASE_URL                          # Provider host URL
  -c, [--provider-states-setup-url=PROVIDER_STATES_SETUP_URL]        # Base URL to setup the provider states at
      [--pact-broker-base-url=PACT_BROKER_BASE_URL]                  # Base URL of the Pact Broker from which to retrieve the pacts.
  -n, [--broker-username=BROKER_USERNAME]                            # Pact Broker basic auth username
  -p, [--broker-password=BROKER_PASSWORD]                            # Pact Broker basic auth password
  -k, [--broker-token=BROKER_TOKEN]                                  # Pact Broker bearer token
      [--provider=PROVIDER]                                          
      [--consumer-version-tag=TAG]                                   # Retrieve the latest pacts with this consumer version tag. Used in conjunction with --provider. May be specified multiple times.
  -a, [--provider-app-version=PROVIDER_APP_VERSION]                  # Provider application version, required when publishing verification results
  -r, [--publish-verification-results=PUBLISH_VERIFICATION_RESULTS]  # Publish verification results to the broker
      [--custom-provider-header=CUSTOM_PROVIDER_HEADER]              # Header to add to provider state set up and pact verification requests. eg 'Authorization: Basic cGFjdDpwYWN0'. May be specified multiple times.
      [--custom-middleware=FILE]                                     # Ruby file containing a class implementing Pact::ProviderVerifier::CustomMiddleware. This allows the response to be modified before replaying. Use with caution!
  -v, [--verbose=VERBOSE]                                            # Verbose output
  -f, [--format=FORMATTER]                                           # RSpec formatter. Defaults to custom Pact formatter. Other options are json and RspecJunitFormatter (which outputs xml).
  -o, [--out=FILE]                                                   # Write output to a file instead of $stdout.

Verify pact(s) against a provider. Supports local and networked (http-based) files.

```

<a name="pact-broker-client"></a>
### pact-broker client

To connect to a Pact Broker that uses custom SSL cerificates, set the environment variable `$SSL_CERT_FILE` or `$SSL_CERT_DIR` to a path that contains the appropriate certificate.

<a name="pact-broker-client-publish"></a>
#### publish

```
Usage:
  pact-broker publish PACT_DIRS_OR_FILES ... -a, --consumer-app-version=CONSUMER_APP_VERSION -b, --broker-base-url=BROKER_BASE_URL

Options:
  -a, --consumer-app-version=CONSUMER_APP_VERSION          # The consumer application version
  -b, --broker-base-url=BROKER_BASE_URL                    # The base URL of the Pact Broker
  -u, [--broker-username=BROKER_USERNAME]                  # Pact Broker basic auth username
  -p, [--broker-password=BROKER_PASSWORD]                  # Pact Broker basic auth password
  -k, [--broker-token=BROKER_TOKEN]                        # Pact Broker bearer token
  -t, [--tag=TAG]                                          # Tag name for consumer version. Can be specified multiple times.
  -g, [--tag-with-git-branch], [--no-tag-with-git-branch]  # Tag consumer version with the name of the current git branch. Default: false
  -v, [--verbose], [--no-verbose]                          # Verbose output. Default: false

Publish pacts to a Pact Broker.

```

<a name="pact-broker-client-can-i-deploy"></a>
#### can-i-deploy

```
can-i-deploy
Usage:
  pact-broker can-i-deploy -a, --pacticipant=PACTICIPANT -b, --broker-base-url=BROKER_BASE_URL

Options:
  -a, --pacticipant=PACTICIPANT            # The pacticipant name. Use once for each pacticipant being checked.
  -e, [--version=VERSION]                  # The pacticipant version. Must be entered after the --pacticipant that it relates to.
  -l, [--latest=[TAG]]                     # Use the latest pacticipant version. Optionally specify a TAG to use the latest version with the specified tag.
      [--to=TAG]                           # This is too hard to explain in a short sentence. Look at the examples.
  -b, --broker-base-url=BROKER_BASE_URL    # The base URL of the Pact Broker
  -u, [--broker-username=BROKER_USERNAME]  # Pact Broker basic auth username
  -p, [--broker-password=BROKER_PASSWORD]  # Pact Broker basic auth password
  -k, [--broker-token=BROKER_TOKEN]        # Pact Broker bearer token
  -o, [--output=OUTPUT]                    # json or table
                                           # Default: table
  -v, [--verbose], [--no-verbose]          # Verbose output. Default: false
      [--retry-while-unknown=TIMES]        # The number of times to retry while there is an unknown verification result (ie. the provider verification is likely still running)
                                           # Default: 0
      [--retry-interval=SECONDS]           # The time between retries in seconds. Use in conjuction with --retry-while-unknown
                                           # Default: 10

Description:
  Returns exit code 0 or 1, indicating whether or not the specified pacticipant
  versions are compatible. Prints out the relevant pact/verification details.

  The environment variables PACT_BROKER_BASE_URL, PACT_BROKER_BASE_URL_USERNAME
  and PACT_BROKER_BASE_URL_PASSWORD may be used instead of their respective
  command line options.

  SCENARIOS

  # If every build goes straight to production

  Check the status of the pacts for a pacticipant version. Note that this only
  checks that the most recent verification for each pact is successful. It
  doesn't provide any assurance that the pact has been verified by the
  *production* version of the provider, however, it is sufficient if you are
  doing true continuous deployment.

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT --version VERSION
  --broker-base-url BROKER_BASE_URL

  # If every build does NOT go straight to production

  ## Recommended approach

  If all applications within the pact network are not being deployed continuously
  (ie. if there is a gap between pact verification and actual deployment) then
  the following strategy is recommended. Each application version should be
  tagged in the broker with the name of the stage (eg. test, staging,
  production) as it is deployed (see the pact-broker create-version-tag CLI).
  This enables you to use the following very simple command to check if the
  application version you are about to deploy is compatible with every other
  application version already deployed in that environment.

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT --version VERSION --to
  TAG --broker-base-url BROKER_BASE_URL

  ## Other approaches

  If you do not/cannot tag every application at deployment, you have two options.
  You can either use the very first form of this command which just checks that
  the *latest* verification is successful (not recommended as it's the
  production version that you really care about) or you will need to determine
  the production versions of each collaborating application from some other
  source (eg. git) and explictly reference each one using one using the format
  `--pacticipant PACTICIPANT1 --version VERSION1 --pacticipant PACTICIPANT2
  --version VERSION2 ...`

  # Other commands

  Check the status of the pacts for the latest pacticipant version. This form is not
  recommended for use in your CI as it is possible that the version you are
  about to deploy is not the the version that the Broker considers the latest.
  It's best to specify the version explictly.

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT --latest
  --broker-base-url BROKER_BASE_URL

  Check the status of the pacts for the latest pacticipant version for a given tag:

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT --latest TAG
  --broker-base-url BROKER_BASE_URL

  Check the status of the pacts between two (or more) specific pacticipant versions:

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT1 --version VERSION1
  --pacticipant PACTICIPANT2 --version VERSION2 --broker-base-url
  BROKER_BASE_URL

  Check the status of the pacts between the latest versions of two (or more)
  pacticipants:

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT1 --latest --pacticipant
  PACTICIPANT2 --latest --broker-base-url BROKER_BASE_URL

  Check the status of the pacts between the latest versions of two (or more)
  pacticipants with a given tag:

  $ pact-broker can-i-deploy --pacticipant PACTICIPANT1 --latest TAG1
  --pacticipant PACTICIPANT2 --latest TAG2 --broker-base-url BROKER_BASE_URL

```

<a name="pact"></a>
### pact

<a name="pact-docs"></a>
#### docs
```
Usage:
  pact docs

Options:
  [--pact-dir=PACT_DIR]  # Directory containing the pacts
                         # Default: /home/travis/build/pact-foundation/pact-ruby-standalone/build/tmp/spec/pacts
  [--doc-dir=DOC_DIR]    # Documentation directory
                         # Default: /home/travis/build/pact-foundation/pact-ruby-standalone/build/tmp/doc/pacts

Generate Pact documentation in markdown

```

### pact-message

```
Commands:
  pact-message help [COMMAND]                                                ...
  pact-message reify                                                         ...
  pact-message update MESSAGE_JSON --consumer=CONSUMER --pact-dir=PACT_DIR --...
  pact-message version                                                       ...
```