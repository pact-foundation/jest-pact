import * as pact from '@pact-foundation/pact';
import { LogLevel, PactOptions } from '@pact-foundation/pact/dsl/options';
import * as path from 'path';

export type JestPactOptions = PactOptions & {
  timeout?: number;
  logDir?: string;
  logFileName?: string;
};

export type JestProvidedPactFn = (provider: pact.Pact) => void;

const logHint = (options: JestPactOptions) =>
  options.port ? `-port-${options.port}` : '';

const applyDefaults = (options: JestPactOptions) => ({
  log: path.resolve(
    options.logDir ? options.logDir : path.join(process.cwd(), 'pact', 'logs'),
    options.logFileName
      ? options.logFileName
      : `${options.consumer}-${
          options.provider
        }-mockserver-interaction${logHint(options)}.log`,
  ),
  dir: path.resolve(process.cwd(), 'pact/pacts'),
  spec: 2,
  logLevel: 'warn' as LogLevel,
  pactfileWriteMode: 'update' as pact.PactfileWriteMode,
  ...options,
});

const setupProvider = (options: JestPactOptions) => {
  const pactMock: pact.Pact = new pact.Pact(options);

  beforeAll(() => pactMock.setup());
  afterAll(() => pactMock.finalize());
  afterEach(() => pactMock.verify());

  return pactMock;
};

// This should be moved to pact-js, probably
export const getProviderBaseUrl = (provider: pact.Pact) =>
  provider.mockService
    ? provider.mockService.baseUrl
    : `http://${provider.opts.host}:${provider.opts.port}`;

const jestPactWrapper = (
  options: JestPactOptions,
  tests: JestProvidedPactFn,
): void => {
  const pactTestTimeout = options.timeout || 30000;

  describe(`with ${pactTestTimeout} ms timeout for Pact`, () => {
    let originalTimeout: number;

    beforeAll(() => {
      // Jest's default timeout is 5000, and jest doesn't provide a way of
      // asking what the current timeout is. In Jest 24 and 25, Jasmine was probably
      // the test runner, so we can ask Jasmine if it is there. In later versions of
      // Jest (eg 26 and up), Jasmine may not be defined.
      // See https://github.com/pact-foundation/jest-pact/issues/197 for discussion
      //
      // For now, we just assume that 5000 was the original timeout.
      // The impact is likely to be small, as `jest.setTimeout()` only works for the
      // current test file
      originalTimeout = jasmine ? jasmine.DEFAULT_TIMEOUT_INTERVAL : 5000;
      jest.setTimeout(pactTestTimeout);
    });

    afterAll(() => {
      jest.setTimeout(originalTimeout);
    });

    tests(setupProvider(applyDefaults(options)));
  });
};

const describeString = (options: JestPactOptions) =>
  `Pact between ${options.consumer} and ${options.provider}`;

export const pactWith = (options: JestPactOptions, tests: JestProvidedPactFn) =>
  describe(describeString(options), () => jestPactWrapper(options, tests));

export const xpactWith = (
  options: JestPactOptions,
  tests: JestProvidedPactFn,
) => xdescribe(describeString(options), () => jestPactWrapper(options, tests));

export const fpactWith = (
  options: JestPactOptions,
  tests: JestProvidedPactFn,
) => fdescribe(describeString(options), () => jestPactWrapper(options, tests));
