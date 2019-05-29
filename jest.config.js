module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/*.test.(ts)"],
  testEnvironment: "node",
  reporters: ["default", [ "jest-junit", { output: "./coverage/junit/unit" } ]]
};
