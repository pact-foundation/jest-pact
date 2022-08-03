interface TimeoutOption {
  timeout?: number;
}

export const withTimeout = (
  options: TimeoutOption,
  tests: () => void
): void => {
  const pactTestTimeout = options.timeout || 30000;

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

  describe(`with ${pactTestTimeout} ms timeout for Pact`, () => {
    tests();
  });
};
