import * as pact from '@pact-foundation/pact';
import * as path from 'path';

export interface PactOptions {
  provider: string;
  consumer: string;
  port?: number;
  logLevel?: LogLevel;
  pactfileWriteMode?: PactFileWriteMode;
  dir?: string;
  timeout?: number;
}

export declare type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export declare type PactFileWriteMode = 'overwrite' | 'update' | 'merge';

const applyDefaults = (options: PactOptions) => ({
  port: options.port,
  log: path.resolve(
    process.cwd(),
    'pact/logs',
    `${options.consumer}-${options.provider}-mockserver-integration.log`,
  ),
  dir: path.resolve(process.cwd(), 'pact/pacts'),
  spec: 2,
  logLevel: options.logLevel || 'error',
  pactfileWriteMode: options.pactfileWriteMode || 'update',
  ...options,
});

const setupProvider = (options: PactOptions) => {
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

export const pactWith = (options: PactOptions, tests: any) =>
  describe(`Pact between ${options.consumer} and ${options.provider}`, () => {
    const pactTestTimeout = options.timeout || 30000;

    describe(`with ${pactTestTimeout} ms timeout for Pact`, () => {
      let originalTimeout: number;

      beforeAll(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = pactTestTimeout;
      });

      afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });

      tests(setupProvider(applyDefaults(options)));
    });
  });
