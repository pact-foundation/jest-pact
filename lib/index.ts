import * as pact from "@pact-foundation/pact";
import * as path from "path";
import * as supertest from "supertest";

export interface PactOptions {
  provider: string;
  consumer: string;
  port?: number;
  logLevel?: LogLevel;
}

export declare type LogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export const pactWith = (options: PactOptions, tests: any) =>
  describe(`Pact between ${options.consumer} and ${options.provider}`, () => {
    const pactMock: pact.Pact = new pact.Pact({
      port: options.port || 8282,
      log: path.resolve(
        process.cwd(),
        "pact/logs",
        `${options.consumer}-${options.provider}-mockserver-integration.log`
      ),
      dir: path.resolve(process.cwd(), "pact/pacts"),
      spec: 2,
      logLevel: options.logLevel || "error",
      pactfileWriteMode: "update",
      ...options
    });

    beforeAll(() => pactMock.setup());
    afterAll(() => pactMock.finalize());
    afterEach(() => pactMock.verify());

    tests(pactMock);
  });

export const pactWithSuperTest = (options: PactOptions, tests: any) =>
  describe(`Pact between ${options.consumer} and ${options.provider}`, () => {
    const pactMock: pact.Pact = new pact.Pact({
      port: options.port || 8989,
      log: path.resolve(
        process.cwd(),
        "pact/logs",
        `${options.consumer}-${options.provider}-mockserver-integration.log`
      ),
      dir: path.resolve(process.cwd(), "pact/pacts"),
      spec: 2,
      logLevel: options.logLevel || "error",
      pactfileWriteMode: "update",
      ...options
    });

    beforeAll(() => pactMock.setup());
    afterAll(() => pactMock.finalize());
    afterEach(() => pactMock.verify());

    const client: supertest.SuperTest<supertest.Test> = getClient(8989);

    tests(pactMock, client);
  });

const getClient = (port: number) => {
  const url = `http://localhost:${port}`;
  return supertest(url);
};
