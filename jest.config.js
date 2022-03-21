module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/*.test.(ts)"],
  testEnvironment: "node",
  reporters: ["default", [ "jest-junit", { output: "./coverage/junit/unit" } ]],
  watchPathIgnorePatterns: ["pact/logs/*","pact/pacts/*"]
};
