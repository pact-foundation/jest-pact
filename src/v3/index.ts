import * as pactV3 from '@pact-foundation/pact';
import * as path from 'path';

export type JestPactOptionsV3 = Omit<pactV3.PactV3Options, 'dir'> & {
  dir?: string;
  timeout?: number;
};

type ExecuteTestFn = (mockServer: pactV3.V3MockServer) => Promise<unknown>;

interface DescibeArg {
  provider: pactV3.PactV3;
  execute: JestPactExecuteTestFn;
}

type JestPactExecuteTestFn = (description: string, fn: ExecuteTestFn) => void;

export type JestProvidedPactFnV3 = (D: DescibeArg) => void;
export type JestDescribePactFnV3 = (
  description: string,
  fn: JestProvidedPactFnV3,
) => void;

export type JestProvidedDescribeFnV3 = (
  pactDescribe: JestDescribePactFnV3,
) => void;

const applyDefaults = (options: JestPactOptionsV3): pactV3.PactV3Options => ({
  dir: path.resolve(process.cwd(), 'pact/pacts'),
  ...options,
});

const setupProvider = (options: pactV3.PactV3Options) => {
  const pactDescribe: JestDescribePactFnV3 = (
    describeDescription: string,
    fn: JestProvidedPactFnV3,
  ) => {
    describe(describeDescription, () => {
      const provider = new pactV3.PactV3(options);
      const execute = (testDescription: string, executeTest: ExecuteTestFn) => {
        it(testDescription, () => provider.executeTest(executeTest));
      };
      fn({ provider, execute });
    });
  };
  return pactDescribe;
};

const jestPactWrapper = (
  options: JestPactOptionsV3,
  tests: JestProvidedDescribeFnV3,
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
      originalTimeout = global.jasmine
        ? global.jasmine.DEFAULT_TIMEOUT_INTERVAL
        : 5000;
      jest.setTimeout(pactTestTimeout);
    });

    afterAll(() => {
      jest.setTimeout(originalTimeout);
    });

    tests(setupProvider(applyDefaults(options)));
  });
};

const describeString = (options: JestPactOptionsV3) =>
  `Pact between ${options.consumer} and ${options.provider}`;

export const pactWith = (
  options: JestPactOptionsV3,
  tests: JestProvidedDescribeFnV3,
) => describe(describeString(options), () => jestPactWrapper(options, tests));

export const xpactWith = (
  options: JestPactOptionsV3,
  tests: JestProvidedDescribeFnV3,
) => xdescribe(describeString(options), () => jestPactWrapper(options, tests));

export const fpactWith = (
  options: JestPactOptionsV3,
  tests: JestProvidedDescribeFnV3,
) => fdescribe(describeString(options), () => jestPactWrapper(options, tests));
