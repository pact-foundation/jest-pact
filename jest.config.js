module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
    // Transpiles the ESM-only packages listed in transformIgnorePatterns to CJS
    '^.+\\.js$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  // @pact-foundation/pact depends on https-proxy-agent@9, which ships ESM only
  // (as do its dependencies agent-base and proxy-agent-negotiate). Jest's CJS
  // loader cannot require them, so they are exempted from the default ignore.
  // The optional path prefix also covers copies nested under another package.
  transformIgnorePatterns: [
    '/node_modules/(?!(?:.*/)?(https-proxy-agent|agent-base|proxy-agent-negotiate)/)',
  ],
  testMatch: ['**/*.test.(ts)'],
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }],
  ],
  watchPathIgnorePatterns: ['pact/logs/*', 'pact/pacts/*'],
};
