import { Pact } from '@pact-foundation/pact';
import { applyPactOptionDefaults } from './internal/config';
import { WrapperFn } from './internal/types';
import { withTimeout } from './internal/withTimeout';

import { extendPactWith } from './internal/scaffold';
import { JestPactOptions, JestProvidedPactFn } from './types';

const setupProvider = (options: JestPactOptions): Pact => {
  const pactMock: Pact = new Pact(options);

  beforeAll(() => pactMock.setup());
  afterAll(() => pactMock.finalize());
  // Fails if enabled - Error in native callback
  //   Error in native callback
  //   at Object.mockServerMismatches (node_modules/@pact-foundation/pact-core/src/consumer/index.ts:94:13)
  //   at Object.<anonymous> (src/index.ts:37:28)
  afterEach(() => pactMock.verify());

  return pactMock;
};

// This should be moved to pact-js, probably
export const getProviderBaseUrl = (provider: Pact) =>
  provider.mockService
    ? provider.mockService.baseUrl
    : `http://${provider.opts.host}:${provider.opts.port}`;

const pactWithWrapper = (
  options: JestPactOptions,
  tests: JestProvidedPactFn
): void => {
  withTimeout(options, () => {
    tests(setupProvider(applyPactOptionDefaults(options)));
  });
};

export const pactWith = extendPactWith<
  JestPactOptions,
  JestProvidedPactFn,
  WrapperFn<JestPactOptions, JestProvidedPactFn>
>(pactWithWrapper);

export const xpactWith = pactWith.skip;
export const fpactWith = pactWith.only;
