import { PactV2 } from '@pact-foundation/pact';
import { applyPactOptionDefaults } from './internal/config';
import { extendPactWith } from './internal/scaffold';
import type { WrapperFn } from './internal/types';
import { withTimeout } from './internal/withTimeout';
import type { JestPactOptions, JestProvidedPactFn } from './types';

const setupProvider = (options: JestPactOptions): PactV2 => {
  const pactMock: PactV2 = new PactV2(options);

  beforeAll(() => pactMock.setup());
  afterAll(() => pactMock.finalize());
  afterEach(() => pactMock.verify());

  return pactMock;
};

// This should be moved to pact-js, probably
export const getProviderBaseUrl = (provider: PactV2): string =>
  provider.mockService
    ? provider.mockService.baseUrl
    : `http://${provider.opts.host}:${provider.opts.port}`;

const pactWithWrapper = (
  options: JestPactOptions,
  tests: JestProvidedPactFn,
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
